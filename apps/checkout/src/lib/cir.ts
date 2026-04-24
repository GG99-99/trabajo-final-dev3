/**
 * cir.ts — Capa de Integración Resiliente (cliente) — Checkout
 */

export async function registerCIR(): Promise<void> {
  if (!('serviceWorker' in navigator)) {
    console.warn('[CIR-Checkout] Service Workers no soportados en este navegador')
    return
  }
  try {
    const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' })
    console.log('[CIR-Checkout] Service Worker registrado ✓')
    reg.addEventListener('updatefound', () => {
      reg.installing?.addEventListener('statechange', function () {
        if (this.state === 'installed') console.log('[CIR-Checkout] Nueva versión del SW disponible')
      })
    })
  } catch (err) {
    console.error('[CIR-Checkout] Error registrando Service Worker:', err)
  }
}

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

type CoreStatusPayload = { alive: boolean; pendingCount: number }
type CoreStatusListener = (payload: CoreStatusPayload) => void
type QueueListener = (pendingCount: number) => void

const _coreListeners: CoreStatusListener[] = []
const _queueListeners: QueueListener[]     = []

if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('message', (event) => {
    const { type, alive, pendingCount } = event.data ?? {}

    if (type === 'CORE_STATUS') {
      _coreListeners.forEach(fn => fn({ alive, pendingCount: pendingCount ?? 0 }))
      _queueListeners.forEach(fn => fn(pendingCount ?? 0))
    }

    if (type === 'QUEUE_UPDATE') {
      _queueListeners.forEach(fn => fn(pendingCount ?? 0))
    }
  })
}

export function onCoreStatusChange(fn: CoreStatusListener): () => void {
  _coreListeners.push(fn)
  return () => {
    const i = _coreListeners.indexOf(fn)
    if (i !== -1) _coreListeners.splice(i, 1)
  }
}

export function onQueueChange(fn: QueueListener): () => void {
  _queueListeners.push(fn)
  return () => {
    const i = _queueListeners.indexOf(fn)
    if (i !== -1) _queueListeners.splice(i, 1)
  }
}
