/**
 * redis.ts
 * Cliente Redis singleton para toda la aplicación.
 * Usa ioredis con reconexión automática y manejo silencioso de errores
 * para que si Redis no está disponible, la app siga funcionando sin caerse.
 */

import Redis from 'ioredis'

const REDIS_URL = process.env.REDIS_URL ?? 'redis://localhost:6379'

let _client: Redis | null = null
let _available = false

function createClient(): Redis {
  const client = new Redis(REDIS_URL, {
    maxRetriesPerRequest: 1,
    enableReadyCheck: false,
    lazyConnect: true,
    retryStrategy: (times) => {
      if (times > 5) return null   // deja de reintentar tras 5 intentos
      return Math.min(times * 500, 3000)
    },
  })

  client.on('ready', () => {
    _available = true
    console.log('[redis] conectado ✓')
  })

  client.on('error', (err) => {
    if (_available) {
      console.warn('[redis] conexión perdida, modo degradado activo:', err.message)
    }
    _available = false
  })

  client.on('reconnecting', () => {
    console.log('[redis] reconectando...')
  })

  return client
}

export function getRedis(): Redis {
  if (!_client) {
    _client = createClient()
    _client.connect().catch(() => {})  // intento silencioso
  }
  return _client
}

export function isRedisAvailable(): boolean {
  return _available
}

/**
 * Ejecuta una operación Redis de forma segura.
 * Si Redis no está disponible, retorna el fallback en vez de lanzar.
 */
export async function safeRedis<T>(
  fn: (r: Redis) => Promise<T>,
  fallback: T
): Promise<T> {
  if (!_available) return fallback
  try {
    return await fn(getRedis())
  } catch {
    return fallback
  }
}
