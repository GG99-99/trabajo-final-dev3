/**
 * cir.ts — Capa de Integración Resiliente (cliente) — Frontend
 *
 * Registra el SW y expone listeners para que la UI reaccione
 * cuando el core backend cambia de estado (vivo ↔ caído).
 */

// ─── Registro del SW ──────────────────────────────────────────────────────────

export async function registerCIR(): Promise<void> {
  if (!('serviceWorker' in navigator)) {
    console.warn('[CIR] Service Workers no soportados en este navegador')
    return
  }
  try {
    const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' })
    console.log('[CIR] Service Worker registrado ✓')
    reg.addEventListener('updatefound', () => {
      reg.installing?.addEventListener('statechange', function () {
        if (this.state === 'installed') console.log('[CIR] Nueva versión del SW disponible')
      })
    })
  } catch (err) {
    console.error('[CIR] Error registrando Service Worker:', err)
  }
}

// ─── Comunicación con el SW ───────────────────────────────────────────────────

export function sendSWMessage(message: Record<string, unknown>): void {
  if (!navigator.serviceWorker.controller) return
  navigator.serviceWorker.controller.postMessage(message)
}

export function triggerSync(): void {
  sendSWMessage({ type: 'DRAIN_QUEUE' })
}

export async function getCIRStatus(): Promise<{
  alive: boolean
  pendingCount: number
  cacheCount: number
  queue: unknown[]
}> {
  return new Promise((resolve) => {
    const timeout = setTimeout(
      () => resolve({ alive: true, pendingCount: 0, cacheCount: 0, queue: [] }),
      2000,
    )
    const handler = (event: MessageEvent) => {
      if (event.data?.type === 'STATUS') {
        clearTimeout(timeout)
        navigator.serviceWorker.removeEventListener('message', handler)
        resolve({
          alive:        event.data.alive ?? true,
          pendingCount: event.data.pendingCount ?? 0,
          cacheCount:   event.data.cacheCount ?? 0,
          queue:        event.data.queue ?? [],
        })
      }
    }
    navigator.serviceWorker.addEventListener('message', handler)
    sendSWMessage({ type: 'GET_STATUS' })
  })
}

// ─── Listeners ───────────────────────────────────────────────────────────────

type CoreStatusPayload = { alive: boolean; pendingCount: number }
type CoreStatusListener = (payload: CoreStatusPayload) => void
type QueueListener = (pendingCount: number) => void

const _coreListeners: CoreStatusListener[] = []
const _queueListeners: QueueListener[]     = []

if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('message', (event) => {
    const { type, alive, pendingCount } = event.data ?? {}

    if (type === 'CORE_STATUS') {
      // El core cambió de estado (vivo ↔ caído)
      _coreListeners.forEach(fn => fn({ alive, pendingCount: pendingCount ?? 0 }))
      _queueListeners.forEach(fn => fn(pendingCount ?? 0))
    }

    if (type === 'QUEUE_UPDATE') {
      _queueListeners.forEach(fn => fn(pendingCount ?? 0))
    }
  })
}

/** Escucha cambios de estado del core (CORE_STATUS). Devuelve unsubscribe. */
export function onCoreStatusChange(fn: CoreStatusListener): () => void {
  _coreListeners.push(fn)
  return () => {
    const i = _coreListeners.indexOf(fn)
    if (i !== -1) _coreListeners.splice(i, 1)
  }
}

/** Escucha cambios en el conteo de escrituras pendientes. Devuelve unsubscribe. */
export function onQueueChange(fn: QueueListener): () => void {
  _queueListeners.push(fn)
  return () => {
    const i = _queueListeners.indexOf(fn)
    if (i !== -1) _queueListeners.splice(i, 1)
  }
}
