import { useState } from 'react'
import axios from 'axios'
import type { LoginData } from '@final/shared'
import { loginCashier } from '../services'

type Props = {
  onLoggedIn: () => void
}

function LoginPage({ onLoggedIn }: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const body: LoginData = { email: email.trim(), password }
      const res = await loginCashier(body)
      if (!res.ok || !res.data) {
        const msg =
          typeof res.error === 'string'
            ? res.error
            : (res.error as { message?: string } | null)?.message ?? 'No se pudo iniciar sesión'
        throw new Error(msg)
      }
      onLoggedIn()
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const api = err.response?.data as { error?: { message?: string } } | undefined
        setError(api?.error?.message ?? err.message ?? 'Error de conexión')
      } else {
        setError(err instanceof Error ? err.message : 'Error de conexión')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="checkout-login-page">
      <div className="checkout-login-card">
        <h1>Checkout — Cajero</h1>
        <p className="checkout-login-sub">Inicia sesión para usar facturación y cobros.</p>
        <form onSubmit={handleSubmit} className="checkout-login-form">
          {error && <div className="checkout-error-banner">{error}</div>}
          <label>
            Correo
            <input
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label>
            Contraseña
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <button type="submit" className="checkout-btn-generate" disabled={loading}>
            {loading ? 'Entrando…' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
