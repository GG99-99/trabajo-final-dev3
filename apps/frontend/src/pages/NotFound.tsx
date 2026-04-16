/**
 * NotFound.tsx — Página 404
 */

import { Link } from 'react-router-dom'
import Icon from '@/componentes/Icon'

export default function NotFound() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100svh',
      gap: 20,
      background: 'var(--bg)',
      fontFamily: 'var(--sans)',
    }}>
      <Icon name="mdi:image-broken-variant" size={48} style={{ opacity: 0.2 }} />
      <h1 style={{ fontFamily: 'var(--heading)', fontStyle: 'italic', fontSize: 80, fontWeight: 300, margin: 0, color: 'var(--text-h)', lineHeight: 1 }}>
        404
      </h1>
      <p style={{ color: 'var(--text)', fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', margin: 0 }}>
        Página no encontrada
      </p>
      <Link to="/" style={{
        marginTop: 8,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        background: 'var(--accent)',
        color: '#fff',
        border: 'none',
        padding: '12px 28px',
        fontSize: 11,
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        textDecoration: 'none',
      }}>
        <Icon name="mdi:arrow-left" size={13} />
        Volver al inicio
      </Link>
    </div>
  )
}
