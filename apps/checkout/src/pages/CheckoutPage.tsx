import { useEffect, useState } from 'react'
import { CreateBill, BillWithRelations } from '@final/shared'
import { checkoutService } from '../services'

function CheckoutPage() {
  const [bills, setBills] = useState<BillWithRelations[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    checkoutService.listBills()
      .then((result) => {
        if (!result.ok) {
          throw new Error(result.error?.message ?? 'Error al cargar facturas')
        }
        setBills(result.data ?? [])
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const handleCreateSampleBill = async () => {
    setLoading(true)
    setError(null)

    const payload: CreateBill = {
      client_id: 0,
      worker_id: 0,
      cashier_id: 0,
      create_at: new Date(),
    }

    const result = await checkoutService.createBill(payload)
    setLoading(false)

    if (!result.ok) {
      setError(result.error?.message ?? 'No se pudo crear la factura')
      return
    }

    setBills((current) => (result.data ? [result.data, ...current] : current))
  }

  return (
    <section className="checkout-page">
      <div className="checkout-header">
        <h2>Facturas</h2>
        <button onClick={handleCreateSampleBill} disabled={loading}>
          Crear factura de ejemplo
        </button>
      </div>

      {loading && <p>Cargando...</p>}
      {error && <p className="checkout-error">{error}</p>}

      <div className="checkout-list">
        {bills.length === 0 ? (
          <p>No hay facturas registradas.</p>
        ) : (
          bills.filter((bill) => bill !== null).map((bill) => (
            <article key={bill.bill_id} className="checkout-card">
              <h3>Factura #{bill.bill_id}</h3>
              <p>Cliente: {bill.client_id}</p>
              <p>Estado: {bill.status}</p>
              <p>Detalles: {bill.details?.length ?? 0} artículos</p>
            </article>
          ))
        )}
      </div>
    </section>
  )
}

export default CheckoutPage
