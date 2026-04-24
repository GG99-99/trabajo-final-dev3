import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import axios from 'axios'
import type { CreateFullBill } from '@final/shared'
import { createBill } from '../services'
import { checkApiHealth } from '../services'

const STORAGE_KEY = 'checkout_offline_bill_queue_v1'
const POLL_MS = 6000

export type QueuedBill = {
  id: string
  enqueuedAt: number
  payload: CreateFullBill
}

function reviveCreateFullBill(raw: CreateFullBill): CreateFullBill {
  return {
    ...raw,
    create_at: new Date(raw.create_at as unknown as string | number | Date),
    payments: (raw.payments ?? []).map((p) => ({
      ...p,
      create_at: new Date(p.create_at as unknown as string | number | Date),
    })),
  }
}

function loadQueue(): QueuedBill[] {
  try {
    const s = localStorage.getItem(STORAGE_KEY)
    if (!s) return []
    const parsed = JSON.parse(s) as QueuedBill[]
    if (!Array.isArray(parsed)) return []
    return parsed.map((row) => ({
      ...row,
      payload: reviveCreateFullBill(row.payload),
    }))
  } catch {
    return []
  }
}

function saveQueue(queue: QueuedBill[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(queue))
  } catch {
    /* ignore quota / private mode */
  }
}

/** Fallo de red, timeout o respuesta vacía; no encolar errores 4xx de negocio con body. */
export function isTransientCreateFailure(err: unknown): boolean {
  if (!axios.isAxiosError(err)) return false
  if (!err.response) return true
  const s = err.response.status
  return s === 502 || s === 503 || s === 504
}

type OfflineBillQueueContextValue = {
  queue: readonly QueuedBill[]
  pendingCount: number
  isFlushing: boolean
  enqueueBill: (payload: CreateFullBill) => void
}

const OfflineBillQueueContext = createContext<OfflineBillQueueContextValue | null>(null)

export function OfflineBillQueueProvider({ children }: { children: ReactNode }) {
  const initial = useRef(loadQueue())
  const [queue, setQueue] = useState<QueuedBill[]>(() => initial.current)
  const queueRef = useRef<QueuedBill[]>(initial.current)
  const [isFlushing, setIsFlushing] = useState(false)
  const flushingRef = useRef(false)

  useEffect(() => {
    queueRef.current = queue
  }, [queue])

  useEffect(() => {
    saveQueue([...queue])
  }, [queue])

  const enqueueBill = useCallback((payload: CreateFullBill) => {
    let payloadCopy: CreateFullBill
    try {
      payloadCopy = structuredClone(payload) as CreateFullBill
    } catch {
      payloadCopy = reviveCreateFullBill(JSON.parse(JSON.stringify(payload)) as CreateFullBill)
    }
    setQueue((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        enqueuedAt: Date.now(),
        payload: payloadCopy,
      },
    ])
  }, [])

  const flushQueue = useCallback(async () => {
    if (flushingRef.current) return
    if (queueRef.current.length === 0) return

    const healthy = await checkApiHealth()
    if (!healthy) return

    flushingRef.current = true
    setIsFlushing(true)
    try {
      const snapshot = [...queueRef.current]
      for (const item of snapshot) {
        if (!queueRef.current.some((q) => q.id === item.id)) continue
        try {
          const result = await createBill(item.payload)
          if (result?.ok) {
            setQueue((prev) => prev.filter((q) => q.id !== item.id))
          } else {
            break
          }
        } catch {
          break
        }
      }
    } finally {
      flushingRef.current = false
      setIsFlushing(false)
    }
  }, [])

  useEffect(() => {
    if (queue.length === 0) return
    void flushQueue()
    const id = window.setInterval(() => void flushQueue(), POLL_MS)
    return () => window.clearInterval(id)
  }, [queue.length, flushQueue])

  const value = useMemo<OfflineBillQueueContextValue>(
    () => ({
      queue,
      pendingCount: queue.length,
      isFlushing,
      enqueueBill,
    }),
    [queue, isFlushing, enqueueBill],
  )

  return (
    <OfflineBillQueueContext.Provider value={value}>{children}</OfflineBillQueueContext.Provider>
  )
}

export function useOfflineBillQueue(): OfflineBillQueueContextValue {
  const ctx = useContext(OfflineBillQueueContext)
  if (!ctx) {
    throw new Error('useOfflineBillQueue must be used within OfflineBillQueueProvider')
  }
  return ctx
}
