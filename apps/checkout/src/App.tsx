import CheckoutFormPage from './pages/CheckoutFormPage.js'
import BillPaymentPage from './pages/BillPaymentPage.js'
import CashRegisterClosePage from './pages/CashRegisterClosePage.js'
import LoginPage from './pages/LoginPage.js'
import { useState, useEffect, useCallback } from 'react'
import { useOfflineBillQueue } from './context/OfflineBillQueueContext.tsx'
import { getCashierMe, logoutCashier } from './services'

type ViewMode = 'billing' | 'payments' | 'cashclose'

function App() {
  const { pendingCount, isFlushing } = useOfflineBillQueue()
  const [sessionReady, setSessionReady] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)
  const [cashierEmail, setCashierEmail] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('billing')

  const refreshSession = useCallback(async () => {
    try {
      const r = await getCashierMe()
      if (r.ok && r.data) {
        setLoggedIn(true)
        setCashierEmail(r.data.email)
      } else {
        setLoggedIn(false)
        setCashierEmail(null)
      }
    } catch {
      setLoggedIn(false)
      setCashierEmail(null)
    }
  }, [])

  useEffect(() => {
    void (async () => {
      await refreshSession()
      setSessionReady(true)
    })()
  }, [refreshSession])

  const handleLogout = async () => {
    try {
      await logoutCashier()
    } catch {
      /* cookie puede ya estar limpia */
    }
    setLoggedIn(false)
    setCashierEmail(null)
    setViewMode('billing')
  }

  if (!sessionReady) {
    return (
      <div className="app-shell">
        <p className="checkout-loading">Cargando sesión…</p>
      </div>
    )
  }

  if (!loggedIn) {
    return <LoginPage onLoggedIn={() => void refreshSession()} />
  }

  return (
    <main className="app-shell">
      {pendingCount > 0 && (
        <div className="app-offline-queue-banner" role="status">
          <span>
            {pendingCount === 1
              ? '1 factura pendiente de sincronizar con el servidor.'
              : `${pendingCount} facturas pendientes de sincronizar con el servidor.`}
            {isFlushing ? ' Enviando…' : ' Reintentando cuando la API responda.'}
          </span>
        </div>
      )}
      <header className="app-header">
        <div>
          <h1>Sistema de Checkout</h1>
          <p>
            Aplicación de facturación basada en React
            {cashierEmail ? (
              <span className="app-session-email"> · {cashierEmail}</span>
            ) : null}
          </p>
        </div>
        <nav className="app-nav-tabs">
          <button
            className={viewMode === 'billing' ? 'btn-secondary' : ''}
            onClick={() => setViewMode('billing')}
          >
            Facturar
          </button>
          <button
            className={viewMode === 'payments' ? 'btn-secondary' : ''}
            onClick={() => setViewMode('payments')}
          >
            Pagar factura
          </button>
          <button
            className={viewMode === 'cashclose' ? 'btn-secondary' : ''}
            onClick={() => setViewMode('cashclose')}
          >
            Cierre de Caja
          </button>
          <button type="button" className="btn-logout" onClick={() => void handleLogout()}>
            Salir
          </button>
        </nav>
      </header>
      {viewMode === 'billing' && <CheckoutFormPage />}
      {viewMode === 'payments' && <BillPaymentPage />}
      {viewMode === 'cashclose' && <CashRegisterClosePage />}
    </main>
  )
}

export default App
