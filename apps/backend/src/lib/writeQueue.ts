/**
 * writeQueue.ts
 * Cola de escrituras persistente en Redis para operaciones críticas.
 *
 * Cuando el backend/DB no está disponible, las operaciones de escritura
 * se encolan en una Redis List (RPUSH). Un worker (drainWriteQueue) las
 * procesa en orden FIFO cuando el core vuelve a responder.
 *
 * Módulos que usan esta cola:
 *   - punch    → clockIn / clockOut
 *   - checkout → crear payment / bill
 */

import { safeRedis, isRedisAvailable } from './redis.js'

export interface QueuedWrite {
  id: string
  module: string
  action: string
  payload: Record<string, unknown>
  enqueuedAt: string
  retries: number
}

const QUEUE_KEY  = 'write_queue:pending'
const MAX_RETRY  = 10
const POLL_MS    = 20_000   // cada 20 s intenta drenar

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

/**
 * Encola una operación de escritura para cuando el core esté disponible.
 * Devuelve el item encolado o null si Redis tampoco está disponible.
 */
export async function enqueueWrite(
  module: string,
  action: string,
  payload: Record<string, unknown>
): Promise<QueuedWrite | null> {
  const item: QueuedWrite = {
    id: uid(),
    module,
    action,
    payload,
    enqueuedAt: new Date().toISOString(),
    retries: 0,
  }

  const pushed = await safeRedis(
    r => r.rpush(QUEUE_KEY, JSON.stringify(item)),
    null
  )

  if (pushed === null) {
    console.error('[write-queue] No se pudo encolar: Redis no disponible', item)
    return null
  }

  console.log(`[write-queue] encolado ${module}:${action} id=${item.id}`)
  return item
}

/** Devuelve todos los items pendientes en la cola (sin sacarlos) */
export async function peekQueue(): Promise<QueuedWrite[]> {
  const raw = await safeRedis(r => r.lrange(QUEUE_KEY, 0, -1), [] as string[])
  return raw.flatMap(s => {
    try { return [JSON.parse(s) as QueuedWrite] } catch { return [] }
  })
}

/** Longitud de la cola */
export async function queueLength(): Promise<number> {
  return await safeRedis(r => r.llen(QUEUE_KEY), 0)
}

/**
 * Drena la cola procesando cada item con el handler provisto.
 * El handler recibe el item y debe resolverlo; si lanza, se reintenta.
 */
export async function drainWriteQueue(
  handler: (item: QueuedWrite) => Promise<void>
): Promise<void> {
  if (!isRedisAvailable()) return

  const length = await queueLength()
  if (length === 0) return

  console.log(`[write-queue] drenando ${length} items...`)

  for (let i = 0; i < length; i++) {
    const raw = await safeRedis(r => r.lpop(QUEUE_KEY), null)
    if (!raw) break

    let item: QueuedWrite
    try { item = JSON.parse(raw) }
    catch { continue }  // item corrupto, descartamos

    try {
      await handler(item)
      console.log(`[write-queue] procesado ${item.module}:${item.action} id=${item.id}`)
    } catch (err) {
      item.retries++
      if (item.retries < MAX_RETRY) {
        // Vuelve a encolar al final
        await safeRedis(r => r.rpush(QUEUE_KEY, JSON.stringify(item)), undefined)
        console.warn(`[write-queue] reintento #${item.retries} para ${item.id}`)
      } else {
        console.error(`[write-queue] descartado ${item.id} por exceder reintentos`, err)
      }
      break  // paramos el drenado; el siguiente ciclo lo intentará
    }
  }
}

let _drainTimer: ReturnType<typeof setInterval> | null = null

/**
 * Inicia el worker que drena la cola periódicamente.
 * Llámalo una vez al arrancar la app con el handler adecuado.
 */
export function startQueueWorker(
  handler: (item: QueuedWrite) => Promise<void>
): () => void {
  if (_drainTimer) return () => {}

  drainWriteQueue(handler).catch(() => {})  // intento inmediato
  _drainTimer = setInterval(() => {
    drainWriteQueue(handler).catch(() => {})
  }, POLL_MS)

  return () => {
    if (_drainTimer) { clearInterval(_drainTimer); _drainTimer = null }
  }
}
