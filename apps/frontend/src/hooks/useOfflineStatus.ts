/**
 * useOfflineStatus.ts — Frontend
 *
 * Expone el estado real del core backend (no del navegador).
 * La fuente de verdad es el mensaje CORE_STATUS que manda el SW
 * cada vez que detecta un cambio (vivo → caído o caído → vivo).
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
    // Estado inicial — pregunta al SW cómo está el mundo ahora mismo
    getCIRStatus().then(({ alive, pendingCount, cacheCount }) => {
      setAlive(alive ?? true)
      setPending(pendingCount)
      setCacheCount(cacheCount)
    })

    // Escucha cambios de estado del core desde el SW
    const unsubStatus = onCoreStatusChange(({ alive, pendingCount }) => {
      setAlive(alive)
      setPending(pendingCount)
    })

    // Refresca también cada 15s por si algún mensaje se perdió
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
