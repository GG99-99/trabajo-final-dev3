/**
 * circuitBreaker.ts
 *
 * Circuit Breaker para las llamadas al backend (Prisma/DB).
 * Estados:
 *   CLOSED   → todo normal, las peticiones pasan
 *   OPEN     → el core está caído, se rechaza de inmediato con error 503
 *   HALF_OPEN → prueba si el core recuperó; si funciona → CLOSED, si falla → OPEN
 *
 * El estado se persiste en Redis para que sea compartido entre instancias,
 * pero funciona en memoria como fallback si Redis no está disponible.
 */

import { safeRedis } from './redis.js'

type State = 'CLOSED' | 'OPEN' | 'HALF_OPEN'

const KEY            = 'circuit_breaker:state'
const KEY_FAILURES   = 'circuit_breaker:failures'
const FAILURE_THRESH = Number(process.env.CB_FAILURE_THRESHOLD ?? 5)
const OPEN_TTL_S     = Number(process.env.CB_OPEN_TTL_S       ?? 30)  // segundos en OPEN

// Fallback en memoria
let _memState: State    = 'CLOSED'
let _memFailures        = 0
let _openSince: number  = 0

async function getState(): Promise<State> {
  const val = await safeRedis(r => r.get(KEY), null)
  if (val) return val as State
  return _memState
}

async function setState(state: State, ttl?: number): Promise<void> {
  _memState = state
  if (ttl) {
    await safeRedis(r => r.setex(KEY, ttl, state), undefined)
  } else {
    await safeRedis(r => r.set(KEY, state), undefined)
  }
}

async function incrementFailures(): Promise<number> {
  _memFailures++
  const n = await safeRedis(async r => {
    const count = await r.incr(KEY_FAILURES)
    await r.expire(KEY_FAILURES, OPEN_TTL_S * 2)
    return count
  }, _memFailures)
  return n
}

async function resetFailures(): Promise<void> {
  _memFailures = 0
  await safeRedis(r => r.del(KEY_FAILURES), undefined)
}

/**
 * Envuelve una función que llama a Prisma/DB con lógica de circuit breaker.
 * @throws 503 si el circuito está OPEN
 */
export async function withCircuitBreaker<T>(fn: () => Promise<T>): Promise<T> {
  const state = await getState()

  if (state === 'OPEN') {
    // Comprueba si ya pasó el tiempo de recuperación (en memoria)
    if (Date.now() - _openSince > OPEN_TTL_S * 1000) {
      await setState('HALF_OPEN')
    } else {
      throw { statusCode: 503, name: 'ServiceUnavailable', message: 'El servicio no está disponible temporalmente. Inténtalo en unos segundos.' }
    }
  }

  try {
    const result = await fn()
    // Éxito: si estaba HALF_OPEN, cerramos el circuito
    if (state === 'HALF_OPEN') {
      await setState('CLOSED')
      await resetFailures()
      console.log('[circuit-breaker] circuito cerrado ✓')
    } else if (_memFailures > 0) {
      await resetFailures()
    }
    return result
  } catch (err: any) {
    // Si es un error de negocio (4xx), no cuenta como fallo del core
    if (err?.statusCode && err.statusCode < 500) throw err

    const failures = await incrementFailures()
    console.warn(`[circuit-breaker] fallo #${failures}`)

    if (failures >= FAILURE_THRESH) {
      _openSince = Date.now()
      await setState('OPEN', OPEN_TTL_S)
      console.error('[circuit-breaker] circuito abierto — core no disponible')
    }

    throw err
  }
}

/** Devuelve el estado actual del circuit breaker (para monitoreo) */
export async function getCircuitState(): Promise<{ state: State; failures: number }> {
  const state = await getState()
  return { state, failures: _memFailures }
}
