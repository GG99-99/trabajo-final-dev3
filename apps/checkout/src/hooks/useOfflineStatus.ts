/**
 * useOfflineStatus.ts — Checkout
 */

import { useState, useEffect } from 'react'
import { onCoreStatusChange, getCIRStatus, triggerSync } from '../lib/cir'

export interface OfflineStatus {
  isCoreAlive: boolean
  pendingCount: number
  cacheCount: number
  triggerSync: () => void
}

export function useOfflineStatus(): OfflineStatus {
  const [isCoreAlive, setAlive]     = useState(true)
  const [pendingCount, setPending]  = useState(0)
  const [cacheCount, setCacheCount] = useState(0)

  useEffect(() => {
    getCIRStatus().then(({ alive, pendingCount, cacheCount }) => {
      setAlive(alive ?? true)
      setPending(pendingCount)
      setCacheCount(cacheCount)
    })

    const unsubStatus = onCoreStatusChange(({ alive, pendingCount }) => {
      setAlive(alive)
      setPending(pendingCount)
    })

    const interval = setInterval(async () => {
      const { alive, pendingCount, cacheCount } = await getCIRStatus()
      setAlive(alive ?? true)
      setPending(pendingCount)
      setCacheCount(cacheCount)
    }, 15_000)

    return () => {
      unsubStatus()
      clearInterval(interval)
    }
  }, [])

  return { isCoreAlive, pendingCount, cacheCount, triggerSync }
}
