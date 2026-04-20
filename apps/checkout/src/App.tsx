import CheckoutFormPage from './pages/CheckoutFormPage.js'
import BillPaymentPage from './pages/BillPaymentPage.js'
import CashRegisterClosePage from './pages/CashRegisterClosePage.js'
import { useState } from 'react'

type ViewMode = 'billing' | 'payments' | 'cashclose'

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('billing')

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <h1>Sistema de Checkout</h1>
          <p>Aplicación de facturación basada en React</p>
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
        </nav>
      </header>
      {viewMode === 'billing' && <CheckoutFormPage />}
      {viewMode === 'payments' && <BillPaymentPage />}
      {viewMode === 'cashclose' && <CashRegisterClosePage />}
    </main>
  )
}

export default App
