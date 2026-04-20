import CheckoutFormPage from './pages/CheckoutFormPage.js'
import BillPaymentPage from './pages/BillPaymentPage.js'
import { useState } from 'react'

type ViewMode = 'billing' | 'payments'

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
        </nav>
      </header>
      {viewMode === 'billing' ? <CheckoutFormPage /> : <BillPaymentPage />}
    </main>
  )
}

export default App
