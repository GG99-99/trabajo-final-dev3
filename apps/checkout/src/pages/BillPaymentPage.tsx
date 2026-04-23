import { useEffect, useMemo, useRef, useState } from 'react'
import type {
  BillFinance,
  BillWithRelations,
  CreatePayment,
  PaymentWithRelations,
  PaymentMethod,
} from '@final/shared'
import { createPayment, getTotal, listBills, listPayments } from '../services'
import { emailService } from '../services/emailService'

type BillCard = {
  bill: BillWithRelations
  finance: BillFinance
}

const PAYMENT_METHOD_LABEL: Record<PaymentMethod, string> = {
  cash: 'Efectivo',
  credit_card: 'Tarjeta',
  transfer: 'Transferencia',
}

function BillPaymentPage() {
  const [pendingBills, setPendingBills] = useState<BillCard[]>([])
  const [selectedBill, setSelectedBill] = useState<BillCard | null>(null)
  const [payments, setPayments] = useState<PaymentWithRelations[]>([])
  const [loadingBills, setLoadingBills] = useState(false)
  const [loadingPayments, setLoadingPayments] = useState(false)
  const [submittingPayment, setSubmittingPayment] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const paymentSectionRef = useRef<HTMLElement | null>(null)

  const [paymentData, setPaymentData] = useState<Omit<CreatePayment, 'bill_id'>>({
    cashier_id: 1,
    amount: 0,
    method: 'cash',
    transaction_ref: '',
  })

  const selectedDebt = selectedBill?.finance.debt ?? 0

  const refreshBills = async () => {
    setLoadingBills(true)
    setError(null)
    try {
      const billsResponse = await listBills()
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

      const onlyPending = financeResults.filter((entry) => entry.finance.debt > 0)
      setPendingBills(onlyPending)

      if (selectedBill) {
        const refreshedSelected = onlyPending.find((entry) => entry.bill.bill_id === selectedBill.bill.bill_id) ?? null
        setSelectedBill(refreshedSelected)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cargando facturas pendientes')
    } finally {
      setLoadingBills(false)
    }
  }

  const refreshPayments = async (billId: number) => {
    setLoadingPayments(true)
    setError(null)
    try {
      const paymentsResponse = await listPayments({ bill_id: billId })
      if (!paymentsResponse.ok) {
        throw new Error(paymentsResponse.error?.message ?? 'Error listando pagos')
      }
      setPayments(paymentsResponse.data ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cargando pagos')
    } finally {
      setLoadingPayments(false)
    }
  }

  useEffect(() => {
    void refreshBills()
  }, [])

  const handleSelectBill = async (billCard: BillCard) => {
    setSelectedBill(billCard)
    setSuccess(null)
    setPaymentData((prev) => ({
      ...prev,
      amount: Number(billCard.finance.debt.toFixed(2)),
    }))
    await refreshPayments(billCard.bill.bill_id)
    paymentSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const totalPaid = useMemo(
    () => payments.filter((payment) => !payment.is_refunded).reduce((sum, payment) => sum + Number(payment.amount), 0),
    [payments],
  )

  const handleSubmitPayment = async () => {
    setError(null)
    setSuccess(null)
    if (!selectedBill) {
      setError('Debes seleccionar una factura pendiente')
      return
    }
    if (!paymentData.cashier_id || paymentData.cashier_id <= 0) {
      setError('Cashier inválido')
      return
    }
    if (!Number.isFinite(paymentData.amount) || paymentData.amount <= 0) {
      setError('Monto inválido')
      return
    }
    const payload: CreatePayment = {
      bill_id: selectedBill.bill.bill_id,
      cashier_id: paymentData.cashier_id,
      amount: Number(paymentData.amount),
      method: paymentData.method,
      transaction_ref: paymentData.transaction_ref?.trim(),
    }

    if(selectedBill.bill?.client?.person.email) {
      emailService.sendContactForm({
        user_name: selectedBill.bill.client.person.first_name + ' ' + selectedBill.bill.client.person.last_name,
        user_email: selectedBill.bill.client.person.email,
        subject: 'Pago de factura',
        message: `Pago de factura registrado, monto: ${paymentData.amount}`,
      })
    }

    setSubmittingPayment(true)
    try {
      const response = await createPayment(payload)
      if (!response.ok) {
        throw new Error(response.error?.message ?? 'No se pudo registrar el pago')
      }

      setSuccess('Pago registrado correctamente')
      setPaymentData((prev) => ({
        ...prev,
        amount: 0,
        transaction_ref: '',
      }))

      await Promise.all([refreshBills(), refreshPayments(payload.bill_id)])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error registrando pago')
    } finally {
      setSubmittingPayment(false)
    }
  }

  return (
    <div className="bill-payment-page">
      <header className="checkout-form-header">
        <h2>Pago de Facturas</h2>
      </header>

      {error && <div className="checkout-error-banner">{error}</div>}
      {success && <div className="checkout-success-banner">{success}</div>}

      <section className="checkout-section">
        <div className="bill-payment-section-header">
          <h3>Facturas pendientes</h3>
          <button className="btn-secondary" onClick={() => void refreshBills()} disabled={loadingBills}>
            {loadingBills ? 'Actualizando...' : 'Actualizar'}
          </button>
        </div>

        {loadingBills ? (
          <p className="checkout-loading">Cargando facturas...</p>
        ) : pendingBills.length === 0 ? (
          <p className="checkout-empty">No hay facturas pendientes por pagar.</p>
        ) : (
          <div className="bill-card-grid">
            {pendingBills.map((entry) => (
              <article
                key={entry.bill.bill_id}
                className={`bill-card ${selectedBill?.bill.bill_id === entry.bill.bill_id ? 'is-selected' : ''}`}
              >
                <h4>Factura #{entry.bill.bill_id}</h4>
                <p>Estado: {entry.bill.status}</p>
                <p>Total a pagar: ${Number(entry.finance.total_after_discount).toFixed(2)}</p>
                <p>Deuda pendiente: ${Number(entry.finance.debt).toFixed(2)}</p>
                <button className="checkout-btn-generate" onClick={() => void handleSelectBill(entry)}>
                  Seleccionar para pagar
                </button>
              </article>
            ))}
          </div>
        )}
      </section>

      <section ref={paymentSectionRef} className="checkout-section">
        <h3>Registrar pago</h3>
        {!selectedBill ? (
          <p className="checkout-empty">Selecciona una factura para ver sus pagos y registrar uno nuevo.</p>
        ) : (
          <>
            <div className="bill-payment-summary">
              <p>
                <strong>Factura:</strong> #{selectedBill.bill.bill_id}
              </p>
              <p>
                <strong>Pagado:</strong> ${totalPaid.toFixed(2)}
              </p>
              <p>
                <strong>Deuda pendiente:</strong> ${selectedDebt.toFixed(2)}
              </p>
            </div>

            <div className="bill-payment-form">
              <label>
                Cashier ID
                <input
                  type="number"
                  min={1}
                  value={paymentData.cashier_id}
                  onChange={(e) => setPaymentData((prev) => ({ ...prev, cashier_id: Number(e.target.value) || 0 }))}
                />
              </label>

              <label>
                Monto
                <input
                  type="number"
                  min={0.01}
                  step={0.01}
                  value={paymentData.amount}
                  onChange={(e) => setPaymentData((prev) => ({ ...prev, amount: Number(e.target.value) || 0 }))}
                />
              </label>

              <label>
                Método
                <select
                  value={paymentData.method}
                  onChange={(e) =>
                    setPaymentData((prev) => ({
                      ...prev,
                      method: e.target.value as PaymentMethod,
                    }))
                  }
                >
                  <option value="cash">{PAYMENT_METHOD_LABEL.cash}</option>
                  <option value="credit_card">{PAYMENT_METHOD_LABEL.credit_card}</option>
                  <option value="transfer">{PAYMENT_METHOD_LABEL.transfer}</option>
                </select>
              </label>

              <label>
                Referencia de transacción (opcional)
                <input
                  type="text"
                  value={paymentData.transaction_ref}
                  onChange={(e) => setPaymentData((prev) => ({ ...prev, transaction_ref: e.target.value }))}
                  placeholder="Opcional"
                />
              </label>
            </div>

            <button className="checkout-btn-generate" disabled={submittingPayment} onClick={() => void handleSubmitPayment()}>
              {submittingPayment ? 'Procesando pago...' : 'Registrar pago'}
            </button>

            <div className="bill-payments-history">
              <h4>Pagos de la factura</h4>
              {loadingPayments ? (
                <p className="checkout-loading">Cargando pagos...</p>
              ) : payments.length === 0 ? (
                <p className="checkout-empty">Esta factura no tiene pagos registrados.</p>
              ) : (
                <div className="checkout-list">
                  {payments
                    .filter((payment): payment is PaymentWithRelations => payment !== null)
                    .map((payment, index) => (
                      <article key={payment.payment_id} className="checkout-card">
                        <p>
                          <strong>Pago #{index + 1}</strong>
                        </p>
                        <p>Monto: ${Number(payment.amount).toFixed(2)}</p>
                        <p>Metodo: {PAYMENT_METHOD_LABEL[payment.method]}</p>
                        <p>Referencia: {payment.transaction_ref}</p>
                        <p>Fecha: {new Date(payment.create_at).toLocaleString()}</p>
                      </article>
                    ))}
                </div>
              )}
            </div>
          </>
        )}
      </section>
    </div>
  )
}

export default BillPaymentPage
