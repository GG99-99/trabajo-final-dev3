<<<<<<< HEAD
import { Fragment, useEffect, useMemo, useState } from 'react'
=======
import { useEffect, useState, useCallback } from 'react'
>>>>>>> 70b7825e7eadcc0e47348e8ccec710197c0ae7e6
import type { BillFinance, BillWithRelations } from '@final/shared'
import { getCashOpeningByDate, getTotal, listBills } from '../services'

type BillCard = {
  bill: BillWithRelations
  finance: BillFinance
}

type Props = {
  cashierEmail: string | null
}

const CASH_OPENING_KEY = "checkout_cash_openings_v1"

function CashRegisterClosePage({ cashierEmail }: Props) {
  const [bills, setBills] = useState<BillCard[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0])

  // init cash amount
  // const s = localStorage.getItem(CASH_OPENING_KEY)
  // if(!s) return
  // const parsed = JSON.parse(s) as QueuedBill[]
  

  const openingCash = useMemo(
    () => (cashierEmail ? getCashOpeningByDate(selectedDate, cashierEmail) : 0),
    [selectedDate, cashierEmail],
  )

  const paymentsByMethod = useMemo(() => {
    const totals = { cash: 0, credit_card: 0, transfer: 0 }
    for (const { bill } of bills) {
      for (const p of bill!.payments) {
        if (p.is_refunded) continue
        const amt = Number(p.amount || 0)
        if (p.method === 'cash') totals.cash += amt
        if (p.method === 'credit_card') totals.credit_card += amt
        if (p.method === 'transfer') totals.transfer += amt
      }
    }
    return totals
  }, [bills])

  const totalIncome = bills.reduce((sum, card) => sum + (card.finance.total_with_tax || 0), 0)
  const totalDiscount = bills.reduce((sum, card) => sum + (card.finance.total_discount || 0), 0)
  const totalTax = bills.reduce((sum, card) => sum + (card.finance.tax || 0), 0)
  const totalCollected = paymentsByMethod.cash + paymentsByMethod.credit_card + paymentsByMethod.transfer
  const totalPending = bills.reduce((sum, card) => sum + card.finance.debt, 0)
  const closingCash = openingCash + paymentsByMethod.cash

  const handleDownloadPdf = async () => {
    const { downloadCashCloseReportPdf } = await import('../utils/cashCloseReportPdf')
    downloadCashCloseReportPdf({
      reportDate: selectedDate,
      rows: bills,
      totals: {
        totalIncome,
        totalDiscount,
        totalTax,
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
          <h3>Pago en efectivo</h3>
          <p className="amount success">${paymentsByMethod.cash.toFixed(2)}</p>
        </div>
        <div className="summary-card">
          <h3>Pago con tarjeta</h3>
          <p className="amount success">${paymentsByMethod.credit_card.toFixed(2)}</p>
        </div>
        <div className="summary-card">
          <h3>Pago por transferencia</h3>
          <p className="amount success">${paymentsByMethod.transfer.toFixed(2)}</p>
        </div>
        <div className="summary-card">
          <h3>Impuestos (18%)</h3>
          <p className="amount tax">${totalTax.toFixed(2)}</p>
        </div>
        <div className="summary-card">
          <h3>Total cobrado</h3>
          <p className="amount success">${(totalCollected || 0).toFixed(2)}</p>
        </div>
        <div className="summary-card">
          <h3>Pendiente de Cobro</h3>
          <p className="amount warning">${totalPending.toFixed(2)}</p>
        </div>
        <div className="summary-card">
          <h3>Caja inicial (efectivo)</h3>
          <p className="amount">${openingCash.toFixed(2)}</p>
        </div>
        <div className="summary-card">
          <h3>Caja final (efectivo)</h3>
          <p className="amount">${closingCash.toFixed(2)}</p>
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
                  <th>Impuesto (18%)</th>
                  <th>Total con Impuesto</th>
                  <th>Pagado</th>
                  <th>Deuda</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {bills.map(({ bill, finance }) => {
                  const validPayments = bill.payments.filter((p) => !p.is_refunded)
                  return (
                    <Fragment key={bill.bill_id}>
                      <tr>
                        <td className="bill-id">#{bill.bill_id}</td>
                        <td>{bill.client?.person?.first_name} {bill.client?.person?.last_name}</td>
                        <td>{bill.worker?.person?.first_name} {bill.worker?.person?.last_name}</td>
                        <td>${finance.total.toFixed(2)}</td>
                        <td className="discount">${finance.total_discount.toFixed(2)}</td>
                        <td className="net">${finance.total_after_discount.toFixed(2)}</td>
                        <td className="tax">${finance.tax.toFixed(2)}</td>
                        <td className="total-with-tax">${finance.total_with_tax.toFixed(2)}</td>
                        <td className="paid">${(finance.total_with_tax - finance.debt).toFixed(2)}</td>
                        <td className={finance.debt > 0 ? 'debt pending' : 'debt'}>
                          ${finance.debt.toFixed(2)}
                        </td>
                        <td>
                          <span className={`badge badge-${bill.status}`}>{bill.status}</span>
                        </td>
                      </tr>
                      <tr className="bill-payment-detail-row">
                        <td colSpan={10}>
                          <div className="bill-payment-detail-wrap">
                            <strong>Pagos de factura #{bill.bill_id}</strong>
                            {validPayments.length === 0 ? (
                              <p className="bill-payment-empty">Sin pagos registrados</p>
                            ) : (
                              <ul className="bill-payment-list">
                                {validPayments.map((p) => (
                                  <li key={p.payment_id}>
                                    <span>{new Date(p.create_at).toLocaleTimeString('es-ES')}</span>
                                    <span>{p.method}</span>
                                    <span>${Number(p.amount).toFixed(2)}</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </td>
                      </tr>
                    </Fragment>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  )
}

export default CashRegisterClosePage
