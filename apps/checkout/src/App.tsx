import CheckoutFormPage from './pages/CheckoutFormPage.js'
import BillPaymentPage from './pages/BillPaymentPage.js'
import CashRegisterClosePage from './pages/CashRegisterClosePage.js'
import LoginPage from './pages/LoginPage.js'
import { useState, useEffect, useCallback } from 'react'
<<<<<<< HEAD
import { useOfflineBillQueue } from './context/OfflineBillQueueContext.tsx'
import { getCashierMe, logoutCashier, hasTodayCashOpening, setTodayCashOpening } from './services'
=======
import { useOfflineBillQueue } from './context/OfflineBillQueueContext'
import { getCashierMe, logoutCashier } from './services'
>>>>>>> 70b7825e7eadcc0e47348e8ccec710197c0ae7e6

type ViewMode = 'billing' | 'payments' | 'cashclose'

function App() {
  const { pendingCount, isFlushing } = useOfflineBillQueue()
  const [sessionReady, setSessionReady] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)
  const [cashierEmail, setCashierEmail] = useState<string | null>(null)
  const [openingPromptVisible, setOpeningPromptVisible] = useState(false)
  const [openingInput, setOpeningInput] = useState('')
  const [openingError, setOpeningError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('billing')

  const refreshSession = useCallback(async () => {
    try {
      const r = await getCashierMe()
      if (r.ok && r.data) {
        setLoggedIn(true)
        setCashierEmail(r.data.email)
        setOpeningPromptVisible(!hasTodayCashOpening(r.data.email))
      } else {
        setLoggedIn(false)
        setCashierEmail(null)
        setOpeningPromptVisible(false)
      }
    } catch {
      setLoggedIn(false)
      setCashierEmail(null)
      setOpeningPromptVisible(false)
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
    setOpeningPromptVisible(false)
    setOpeningInput('')
    setOpeningError(null)
    setViewMode('billing')
  }

  const handleSaveOpening = () => {
    if (!cashierEmail) return
    const normalized = openingInput.replace(',', '.').trim()
    const amount = Number.parseFloat(normalized)
    if (!Number.isFinite(amount) || amount < 0) {
      setOpeningError('Ingresa un monto inicial válido (0 o mayor).')
      return
    }
    setTodayCashOpening(cashierEmail, amount)
    setOpeningPromptVisible(false)
    setOpeningInput('')
    setOpeningError(null)
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
      {openingPromptVisible && (
        <div className="cash-opening-overlay" role="dialog" aria-modal="true">
          <div className="cash-opening-card">
            <h2>Apertura de caja</h2>
            <p>Primera sesión del día. Ingresa con cuánto efectivo inicia la caja.</p>
            {openingError && <div className="checkout-error-banner">{openingError}</div>}
            <input
              type="text"
              inputMode="decimal"
              placeholder="0.00"
              value={openingInput}
              onChange={(e) => setOpeningInput(e.target.value)}
            />
            <button type="button" className="checkout-btn-generate" onClick={handleSaveOpening}>
              Guardar monto inicial
            </button>
          </div>
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
      {viewMode === 'cashclose' && <CashRegisterClosePage cashierEmail={cashierEmail} />}
    </main>
  )
}

export default App
