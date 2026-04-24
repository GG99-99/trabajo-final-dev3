/**
 * OfflineBanner.tsx — Frontend
 *
 * Muestra el estado real del core backend (no del navegador).
 * Rojo  → core caído
 * Amarillo → core vivo pero hay operaciones en cola esperando sincronizar
 */

import { useOfflineStatus } from '../hooks/useOfflineStatus'

export function OfflineBanner() {
  const { isCoreAlive, pendingCount, triggerSync } = useOfflineStatus()

  if (isCoreAlive && pendingCount === 0) return null

  return (
    <div
      style={{
        position:        'fixed',
        top:             0,
        left:            0,
        right:           0,
        zIndex:          9999,
        padding:         '8px 16px',
        display:         'flex',
        alignItems:      'center',
        justifyContent:  'space-between',
        fontSize:        '14px',
        fontWeight:      500,
        backgroundColor: isCoreAlive ? '#f59e0b' : '#ef4444',
        color:           '#fff',
        boxShadow:       '0 2px 8px rgba(0,0,0,0.25)',
      }}
    >
      <span>
        {isCoreAlive
          ? `✓ Servidor recuperado — sincronizando ${pendingCount} operación${pendingCount !== 1 ? 'es' : ''}...`
          : `⚠ Servidor no disponible${pendingCount > 0 ? ` — ${pendingCount} operación${pendingCount !== 1 ? 'es' : ''} en cola` : ''}`
        }
      </span>

      {pendingCount > 0 && isCoreAlive && (
        <button
          onClick={triggerSync}
          style={{
            background:   'rgba(255,255,255,0.25)',
            border:       'none',
            borderRadius: '4px',
            color:        '#fff',
            cursor:       'pointer',
            padding:      '4px 12px',
            fontSize:     '13px',
          }}
        >
          Sincronizar ahora
        </button>
      )}
    </div>
  )
}
