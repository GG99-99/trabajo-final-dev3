/**
 * punch.offline.ts
 *
 * Capa de resiliencia para el módulo de ponche.
 *
 * Cuando el core (backend) no está disponible, las acciones de clock-in y
 * clock-out se guardan en localStorage como transacciones pendientes.
 * Un watcher periódico intenta reenviarlas cada vez que detecta que el core
 * volvió a estar disponible.
 *
 * Flujo:
 *   1. punchOffline.clockIn / clockOut intentan el request normal.
 *   2. Si falla por error de red (core caído), guardan la tx en la cola.
 *   3. El watcher (startOfflineWatcher) corre cada POLL_MS ms; cuando el
 *      core responde al health-check, drena la cola en orden FIFO.
 *   4. Los listeners registrados con onQueueChange() reciben la cola
 *      actualizada para que la UI pueda mostrar el estado.
 */

import type { ApiResponse } from '@final/shared'

// ─── Tipos ────────────────────────────────────────────────────────────────────

export type PendingAction = 'in' | 'out'

export interface PendingTransaction {
  id: string            // uuid-lite
  worker_id: number
  action: PendingAction
  /** ISO timestamp del momento en que se registró offline */
  recorded_at: string
  /** Cuántos reintentos de sync se han hecho */
  retries: number
}

// ─── Constantes ───────────────────────────────────────────────────────────────

const STORAGE_KEY  = 'punch_offline_queue'
const POLL_MS      = 15_000   // cada 15 s intenta sincronizar
const MAX_RETRIES  = 10       // descarta la tx si falla muchas veces seguidas
const CORE_URL     = (import.meta.env.VITE_API_URL ?? 'http://localhost:3030/api')
const HEALTH_PATH  = CORE_URL.replace(/\/api$/, '') + '/api/punch/status'

// ─── Queue helpers ────────────────────────────────────────────────────────────

function loadQueue(): PendingTransaction[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as PendingTransaction[]) : []
  } catch {
    return []
  }
}

function saveQueue(q: PendingTransaction[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(q))
}

function uid(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

// ─── Estado interno ───────────────────────────────────────────────────────────

let _watcherTimer: ReturnType<typeof setInterval> | null = null
const _listeners: Array<(q: PendingTransaction[]) => void> = []

function notify(): void {
  const q = loadQueue()
  _listeners.forEach(fn => fn(q))
}

// ─── API pública ──────────────────────────────────────────────────────────────

/** Devuelve una copia de la cola actual */
export function getQueue(): PendingTransaction[] {
  return loadQueue()
}

/** Registra un listener que se llama cada vez que la cola cambia */
export function onQueueChange(fn: (q: PendingTransaction[]) => void): () => void {
  _listeners.push(fn)
  return () => {
    const i = _listeners.indexOf(fn)
    if (i !== -1) _listeners.splice(i, 1)
  }
}

/** Encola una transacción fallida */
export function enqueue(worker_id: number, action: PendingAction): PendingTransaction {
  const tx: PendingTransaction = {
    id: uid(),
    worker_id,
    action,
    recorded_at: new Date().toISOString(),
    retries: 0,
  }
  const q = loadQueue()
  q.push(tx)
  saveQueue(q)
  notify()
  return tx
}

/** Elimina una transacción de la cola (sincronizada o descartada) */
export function dequeue(id: string): void {
  const q = loadQueue().filter(tx => tx.id !== id)
  saveQueue(q)
  notify()
}

/** Detecta si un error es de red (core caído) vs error HTTP del negocio */
export function isNetworkError(err: unknown): boolean {
  if (err instanceof TypeError && err.message.toLowerCase().includes('fetch')) return true
  if (err instanceof Error) {
    const m = err.message.toLowerCase()
    return m.includes('network') || m.includes('failed to fetch') || m.includes('econnrefused')
  }
  return false
}

// ─── Health check ─────────────────────────────────────────────────────────────

async function isCoreAlive(): Promise<boolean> {
  try {
    // Usamos un worker_id ficticio; si el core está vivo responderá con 200
    // aunque devuelva { clocked_in: false }.  Solo nos importa que no falle.
    const res = await fetch(`${HEALTH_PATH}?worker_id=0`, {
      credentials: 'include',
      signal: AbortSignal.timeout(4_000),
    })
    return res.ok
  } catch {
    return false
  }
}

// ─── Sync ─────────────────────────────────────────────────────────────────────

async function syncOne(tx: PendingTransaction): Promise<void> {
  const endpoint = `${CORE_URL}/punch/${tx.action}`
  const res = await fetch(endpoint, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ worker_id: tx.worker_id }),
    signal: AbortSignal.timeout(8_000),
  })

  const data: ApiResponse<unknown> = await res.json()

  if (!res.ok && res.status >= 500) {
    // Error del servidor → reintento posterior
    throw new Error(`HTTP ${res.status}`)
  }

  // 200 OK  o  error de negocio (409 ya fichado, etc.)
  // → en ambos casos consideramos la tx resuelta y la sacamos de la cola
  console.info(
    `[punch.offline] sync ${tx.action} worker=${tx.worker_id}`,
    data.ok ? '✓' : `⚠ ${(data as any).error?.message}`,
  )
  dequeue(tx.id)
}

export async function drainQueue(): Promise<void> {
  const q = loadQueue()
  if (q.length === 0) return

  const alive = await isCoreAlive()
  if (!alive) return

  // Procesamos en orden FIFO, uno a uno (para respetar in → out)
  for (const tx of [...q]) {
    try {
      await syncOne(tx)
    } catch (err) {
      // Incrementar contador de reintentos
      const current = loadQueue()
      const idx = current.findIndex(t => t.id === tx.id)
      if (idx !== -1) {
        current[idx].retries += 1
        if (current[idx].retries >= MAX_RETRIES) {
          console.warn(`[punch.offline] descartando tx ${tx.id} por exceder reintentos`)
          current.splice(idx, 1)
        }
        saveQueue(current)
        notify()
      }
      // Paramos el drenado; el siguiente ciclo lo reintentará
      break
    }
  }
}

// ─── Watcher ──────────────────────────────────────────────────────────────────

/** Inicia el watcher de sincronización. Llámalo una vez al montar la app. */
export function startOfflineWatcher(): () => void {
  if (_watcherTimer !== null) return () => {}  // ya corriendo

  drainQueue() // intento inmediato al arrancar
  _watcherTimer = setInterval(drainQueue, POLL_MS)

  return () => {
    if (_watcherTimer !== null) {
      clearInterval(_watcherTimer)
      _watcherTimer = null
    }
  }
}
