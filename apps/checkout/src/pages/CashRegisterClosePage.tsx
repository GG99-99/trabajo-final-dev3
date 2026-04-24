import { useEffect, useState, useCallback } from 'react'
import type { BillFinance, BillWithRelations } from '@final/shared'
import { getTotal, listBills } from '../services'
import type { Payment } from '@final/shared'

type BillCard = {
  bill: BillWithRelations
  finance: BillFinance
}

function CashRegisterClosePage() {
  const [bills, setBills] = useState<BillCard[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0])

  const totalIncome = bills.reduce((sum, card) => sum + (card.finance.total_after_discount || 0), 0)
  const totalDiscount = bills.reduce((sum, card) => sum + (card.finance.total_discount || 0), 0)
  const totalCollected = bills.reduce((sum, card) => {
    const cardTotal = card.bill.payments.reduce(
      (paymentSum: number, payment: Payment) => paymentSum + (Number(payment.amount) || 0), 
      0 as number,
    )
    return sum + cardTotal
  }, 0 as number)

  const totalPending = bills.reduce((sum, card) => sum + card.finance.debt, 0)

  const handleDownloadPdf = async () => {
    const { downloadCashCloseReportPdf } = await import('../utils/cashCloseReportPdf')
    downloadCashCloseReportPdf({
      reportDate: selectedDate,
      rows: bills,
      totals: {
        totalIncome,
        totalDiscount,
        totalCollected,
        totalPending,
      },
    })
  }

  const refreshBills = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const dateObj = new Date(selectedDate)
      const billsResponse = await listBills({ date: dateObj })
      if (!billsResponse.ok || !billsResponse.data) {
        throw new Error(billsResponse.error?.message ?? 'Error listando facturas')
      }

      const financeResults = await Promise.all(
        billsResponse.data
          .filter((bill): bill is BillWithRelations => bill !== null)
          .map(async (bill) => {
            const totalResponse = await getTotal(bill.bill_id)
            if (!totalResponse.ok || !totalResponse.data) {
              throw new Error(totalResponse.error?.message ?? `Error cargando total de factura #${bill.bill_id}`)
            }
            return {
              bill,
              finance: totalResponse.data,
            }
          }),
      )

      setBills(financeResults)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [selectedDate])

  useEffect(() => {
    void refreshBills()
  }, [refreshBills])

  return (
    <section className="cash-register-close">
      <div className="close-header">
        <h2>Cierre de Caja</h2>
        <div className="date-picker">
          <label htmlFor="date-input">Fecha:</label>
          <input
            id="date-input"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="summary-cards">
        <div className="summary-card">
          <h3>Total de Entrada</h3>
          <p className="amount">${totalIncome.toFixed(2)}</p>
        </div>
        <div className="summary-card">
          <h3>Descuentos</h3>
          <p className="amount discount">${totalDiscount.toFixed(2)}</p>
        </div>
        <div className="summary-card">
          <h3>Total Cobrado</h3>
          <p className="amount success">${(totalCollected || 0).toFixed(2)}</p>
        </div>
        <div className="summary-card">
          <h3>Pendiente de Cobro</h3>
          <p className="amount warning">${totalPending.toFixed(2)}</p>
        </div>
      </div>

      <div className="bills-section">
        <div className="section-header">
          <h3>Facturas del día ({bills.length})</h3>
          <div className="section-header-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={handleDownloadPdf}
              disabled={loading}
            >
              Descargar PDF de cierre
            </button>
            <button className="btn-primary" onClick={refreshBills} disabled={loading}>
              {loading ? 'Cargando...' : 'Actualizar'}
            </button>
          </div>
        </div>

        {bills.length === 0 ? (
          <p className="no-data">No hay facturas para esta fecha</p>
        ) : (
          <div className="bills-table">
            <table>
              <thead>
                <tr>
                  <th>ID Factura</th>
                  <th>Cliente</th>
                  <th>Trabajador</th>
                  <th>Total</th>
                  <th>Descuento</th>
                  <th>Neto</th>
                  <th>Pagado</th>
                  <th>Deuda</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {bills.map(({ bill, finance }) => (
                  <tr key={bill.bill_id}>
                    <td className="bill-id">#{bill.bill_id}</td>
                    <td>{bill.client?.person?.first_name} {bill.client?.person?.last_name}</td>
                    <td>{bill.worker?.person?.first_name} {bill.worker?.person?.last_name}</td>
                    <td>${finance.total.toFixed(2)}</td>
                    <td className="discount">${finance.total_discount.toFixed(2)}</td>
                    <td className="net">${finance.total_after_discount.toFixed(2)}</td>
                    <td className="paid">${(finance.total_after_discount - finance.debt).toFixed(2)}</td>
                    <td className={finance.debt > 0 ? 'debt pending' : 'debt'}>
                      ${finance.debt.toFixed(2)}
                    </td>
                    <td>
                      <span className={`badge badge-${bill.status}`}>{bill.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  )
}

export default CashRegisterClosePage
