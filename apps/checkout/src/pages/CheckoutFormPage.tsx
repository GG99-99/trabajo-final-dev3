import { useState, useEffect, useMemo } from 'react'
import type { CreateFullBill } from '@final/shared'
import type {
  WorkerPublic,
  AppointmentWithRelation,
  ClientPublic,
  ProductVariantWithRelations,
  TattoWithImg,
  PaymentMethod,
} from '@final/shared'
import { createBill, getWorkers, getAppointments, searchClientByEmail, getAllProductVariants, getAllTattoos } from '../services'
import { useOfflineBillQueue, isTransientCreateFailure } from '../context/OfflineBillQueueContext'

interface CartItem {
  id: string
  type: 'product' | 'tattoo'
  name: string
  price: number
  quantity: number
  productVariantId?: number
  tattooId?: number
  fromAppointment?: boolean
}

interface Extra {
  aggregates: { amount: number; reason: string }[]
  discounts: { amount: number; reason: string }[]
}

interface DraftPayment {
  id: string
  amount: number
  method: PaymentMethod
  transaction_ref: string
}

const PAYMENT_METHOD_LABEL: Record<PaymentMethod, string> = {
  cash: 'Efectivo',
  credit_card: 'Tarjeta',
  transfer: 'Transferencia',
}

const parseMoneyInput = (raw: string): number => {
  const normalized = raw.replace(',', '.').trim()
  const parsed = Number.parseFloat(normalized)
  return Number.isFinite(parsed) ? parsed : 0
}

const openInvoicePrint = (params: {
  billId?: number
  date: string
  items: CartItem[]
  aggregates: Extra['aggregates']
  discounts: Extra['discounts']
  payments: DraftPayment[]
  subtotal: number
  total: number
  tax: number
}) => {
  const {
    billId,
    date,
    items,
    aggregates,
    discounts,
    payments,
    subtotal,
    total,
    tax,
  } = params

  const paymentMethodLabel = (m: PaymentMethod) => PAYMENT_METHOD_LABEL[m] ?? m
  const esc = (value: string) =>
    value
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;')

  // Calculate totals for printing
  const aggregatesTotal = aggregates.reduce((sum, agg) => sum + Number(agg.amount || 0), 0)
  const discountsTotal = discounts.reduce((sum, disc) => sum + Number(disc.amount || 0), 0)

  const rows = items
    .map(
      (item) => `
        <tr>
          <td>${esc(item.name)}</td>
          <td>${item.type === 'tattoo' ? 'Tattoo' : 'Producto'}</td>
          <td style="text-align:right;">$${item.price.toFixed(2)}</td>
          <td style="text-align:center;">${item.type === 'tattoo' ? '—' : item.quantity}</td>
          <td style="text-align:right;">$${(item.type === 'tattoo' ? item.price : item.price * item.quantity).toFixed(2)}</td>
        </tr>
      `,
    )
    .join('')

  const aggRows = aggregates
    .filter((a) => Number.isFinite(a.amount) && a.amount !== 0)
    .map(
      (a) => `
        <tr>
          <td>${esc(a.reason || 'Agregado')}</td>
          <td style="text-align:right;">+$${a.amount.toFixed(2)}</td>
        </tr>
      `,
    )
    .join('')

  const disRows = discounts
    .filter((d) => Number.isFinite(d.amount) && d.amount !== 0)
    .map(
      (d) => `
        <tr>
          <td>${esc(d.reason || 'Descuento')}</td>
          <td style="text-align:right;">-$${d.amount.toFixed(2)}</td>
        </tr>
      `,
    )
    .join('')

  const payRows = payments
    .filter((p) => Number.isFinite(p.amount) && p.amount > 0)
    .map(
      (p) => `
        <tr>
          <td>${paymentMethodLabel(p.method)}</td>
          <td style="text-align:right;">$${p.amount.toFixed(2)}</td>
        </tr>
      `,
    )
    .join('')

  const html = `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Factura ${billId ? `#${billId}` : ''}</title>
        <style>
          body { font-family: Arial, sans-serif; color:#111; padding:24px; }
          h1 { margin:0 0 8px; font-size:20px; }
          .meta { margin:0 0 16px; color:#444; font-size:13px; }
          table { width:100%; border-collapse:collapse; margin-bottom:14px; }
          th, td { border-bottom:1px solid #ddd; padding:8px; font-size:13px; }
          th { text-align:left; background:#f4f4f4; }
          .totals td { border-bottom:none; padding:4px 8px; }
          .totals .final td { font-size:16px; font-weight:700; border-top:1px solid #111; padding-top:8px; }
          .section { margin-top:16px; }
        </style>
      </head>
      <body>
        <h1>Factura ${billId ? `#${billId}` : ''}</h1>
        <p class="meta">Fecha: ${esc(date)} &nbsp;|&nbsp; Impresa: ${new Date().toLocaleString('es-ES')}</p>
        <table>
          <thead>
            <tr>
              <th>Concepto</th>
              <th>Tipo</th>
              <th>Precio</th>
              <th>Cant.</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>${rows || '<tr><td colspan="5">Sin ítems</td></tr>'}</tbody>
        </table>

        <div class="section">
          <table>
            <tbody class="totals">
              <tr><td>Subtotal</td><td style="text-align:right;">$${subtotal.toFixed(2)}</td></tr>
              ${aggRows || ''}
              ${disRows || ''}
              <tr class="final"><td>Total</td><td style="text-align:right;">$${total.toFixed(2)}</td></tr>
            </tbody>
          </table>
        </div>

        <div class="section">
          <table>
            <thead><tr><th>Método de pago</th><th style="text-align:right;">Monto</th></tr></thead>
            <tbody>${payRows || '<tr><td colspan="2">Sin pagos registrados al crear</td></tr>'}</tbody>
          </table>
        </div>

        <script>
          window.onload = function() {
            window.focus();
            window.print();
          };
        </script>
      </body>
    </html>
  `

  const iframe = document.createElement('iframe')
  iframe.style.position = 'fixed'
  iframe.style.right = '0'
  iframe.style.bottom = '0'
  iframe.style.width = '0'
  iframe.style.height = '0'
  iframe.style.border = '0'
  iframe.setAttribute('aria-hidden', 'true')
  document.body.appendChild(iframe)

  const doc = iframe.contentWindow?.document
  if (!doc) {
    iframe.remove()
    return
  }

  doc.open()
  doc.write(html)
  doc.close()

  let printed = false
  const triggerPrint = () => {
    if (printed) return
    printed = true
    iframe.contentWindow?.focus()
    iframe.contentWindow?.print()
    window.setTimeout(() => iframe.remove(), 1200)
  }

  iframe.onload = triggerPrint
  window.setTimeout(triggerPrint, 250)
}

function CheckoutFormPage() {
  const { enqueueBill } = useOfflineBillQueue()
  const [saleType, setSaleType] = useState<'direct' | 'appointment'>('direct')
  const [clientId, setClientId] = useState<number | null>(null)
  const [clientEmail, setClientEmail] = useState<string>('')
  const [workerId, setWorkerId] = useState<number>(0)
  const [cashierId] = useState<number>(1)
  const [appointmentId, setAppointmentId] = useState<number | null>(null)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [extra, setExtra] = useState<Extra>({
    aggregates: [],
    discounts: [],
  })
  const [draftPayments, setDraftPayments] = useState<DraftPayment[]>([])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Estados para datos del servidor
  const [workers, setWorkers] = useState<WorkerPublic[]>([])
  const [appointments, setAppointments] = useState<AppointmentWithRelation[]>([])
  const [clientData, setClientData] = useState<ClientPublic | null>(null)
  const [productVariants, setProductVariants] = useState<ProductVariantWithRelations[]>([])
  const [tattoos, setTattoos] = useState<TattoWithImg[]>([])
  const [loadingData, setLoadingData] = useState(false)
  const [dataError, setDataError] = useState<string | null>(null)
  const [selectedProductVariantId, setSelectedProductVariantId] = useState<number>(0)
  const [selectedTattooId, setSelectedTattooId] = useState<number>(0)

  // Cargar workers, appointments, product variants y tattoos al montar
  useEffect(() => {
    const loadData = async () => {
      setLoadingData(true)
      setDataError(null)
      try {
        const [workersRes, appointmentsRes, variantsRes, tattoosRes] = await Promise.all([
          getWorkers(),
          getAppointments(),
          getAllProductVariants(),
          getAllTattoos(),
        ])

        // Todos los servicios devuelven { ok, data } o { ok: false, data: [] } en caso de error
        if (workersRes.ok && workersRes.data) {
          setWorkers(workersRes.data)
        }
        if (appointmentsRes.ok && appointmentsRes.data) {
          setAppointments(appointmentsRes.data)
        }
        if (variantsRes.ok && variantsRes.data) {
          setProductVariants(variantsRes.data ?? [])
        }
        if (tattoosRes.ok && tattoosRes.data) {
          setTattoos(tattoosRes.data ?? [])
        }
      } catch (err) {
        setDataError(err instanceof Error ? err.message : 'Error cargando datos')
        console.error('Error cargando datos del servidor:', err)
      } finally {
        setLoadingData(false)
      }
    }

    loadData()
  }, [])

  useEffect(() => {
    if (saleType !== 'appointment') {
      setCartItems((prevItems) => prevItems.filter((item) => !item.fromAppointment))
      return
    }

    if (!appointmentId) {
      setCartItems((prevItems) => prevItems.filter((item) => !item.fromAppointment))
      return
    }

    const selectedAppointment = appointments.find(
      (appointment) => appointment && appointment.appointment_id === appointmentId,
    )

    if (!selectedAppointment) return

    setWorkerId(selectedAppointment.worker_id)

    const appointmentTattoo = selectedAppointment.tattoo
    if (!appointmentTattoo) {
      setCartItems((prevItems) => prevItems.filter((item) => !item.fromAppointment))
      return
    }

    setCartItems((prevItems) => {
      const itemsWithoutAppointmentTattoo = prevItems.filter((item) => !item.fromAppointment)
      return [
        ...itemsWithoutAppointmentTattoo,
        {
          id: `appointment-tattoo-${selectedAppointment.appointment_id}`,
          type: 'tattoo',
          name: appointmentTattoo.name,
          price: Number(appointmentTattoo.cost),
          quantity: 1,
          tattooId: appointmentTattoo.tattoo_id,
          fromAppointment: true,
        },
      ]
    })
  }, [appointmentId, appointments, saleType])

  // Buscar cliente por email
  const handleSearchClient = async () => {
    if (!clientEmail.trim()) {
      setClientData(null)
      setClientId(null)
      return
    }

    try {
      const result = await searchClientByEmail(clientEmail)
      if (result.ok && result.data) {
        setClientData(result.data)
        setClientId(result.data.client_id)
      } else {
        setClientData(null)
        setClientId(null)
      }
    } catch (err) {
      console.error('Error buscando cliente:', err)
      setClientData(null)
      setClientId(null)
    }
  }

  // Cálculos de totales
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const aggregatesTotal = extra.aggregates.reduce((sum, agg) => sum + Number(agg.amount || 0), 0)
  const discountsTotal = extra.discounts.reduce((sum, disc) => sum + Number(disc.amount || 0), 0)
  const totalAfterDiscount = subtotal + aggregatesTotal - discountsTotal
  const tax = totalAfterDiscount * 0.18
  const total = totalAfterDiscount + tax

  const paymentsSum = useMemo(
    () =>
      draftPayments.reduce((sum, p) => {
        const n = Number(p.amount)
        return sum + (Number.isFinite(n) && n > 0 ? n : 0)
      }, 0),
    [draftPayments],
  )
  const debtRemaining = Math.max(0, total - paymentsSum)
  const overpay = Math.max(0, paymentsSum - total)

  const addProductToCart = () => {
    if (!selectedProductVariantId) {
      setError('Por favor selecciona un producto')
      return
    }
    
    const variant = productVariants.find(v => v && v.product_variant_id === selectedProductVariantId)
    if (!variant) return

    const newItem: CartItem = {
      id: `product-${Date.now()}`,
      type: 'product',
      name: `${variant.product.name} - ${variant.presentation}`,
      price: Number(variant.price),
      quantity: 1,
      productVariantId: variant.product_variant_id,
    }
    setCartItems([...cartItems, newItem])
    setSelectedProductVariantId(0)
    setError(null)
  }

  const addTattooToCart = () => {
    if (!selectedTattooId) {
      setError('Por favor selecciona un tatuaje')
      return
    }
    
    const tattoo = tattoos.find(t => t && t.tattoo_id === selectedTattooId)
    if (!tattoo) return

    const newItem: CartItem = {
      id: `tattoo-${Date.now()}`,
      type: 'tattoo',
      name: tattoo.name,
      price: Number(tattoo.cost),
      quantity: 1,
      tattooId: tattoo.tattoo_id,
    }
    setCartItems([...cartItems, newItem])
    setSelectedTattooId(0)
    setError(null)
  }

  const removeFromCart = (id: string) => {
    setCartItems(cartItems.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    setCartItems(cartItems.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  const addAggregate = () => {
    setExtra({
      ...extra,
      aggregates: [...extra.aggregates, { amount: 0, reason: '' }],
    })
  }

  const removeAggregate = (index: number) => {
    setExtra({
      ...extra,
      aggregates: extra.aggregates.filter((_, i) => i !== index),
    })
  }

  const addDiscount = () => {
    setExtra({
      ...extra,
      discounts: [...extra.discounts, { amount: 0, reason: '' }],
    })
  }

  const removeDiscount = (index: number) => {
    setExtra({
      ...extra,
      discounts: extra.discounts.filter((_, i) => i !== index),
    })
  }

  const addDraftPayment = () => {
    setDraftPayments((prev) => [
      ...prev,
      {
        id: `pay-${Date.now()}`,
        amount: 0,
        method: 'cash',
        transaction_ref: '',
      },
    ])
  }

  const removeDraftPayment = (id: string) => {
    setDraftPayments((prev) => prev.filter((p) => p.id !== id))
  }

  const updateDraftPayment = (id: string, patch: Partial<Omit<DraftPayment, 'id'>>) => {
    setDraftPayments((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    )
  }

  const handleGenerateBill = async () => {
    setError(null)
    setSuccess(null)

    // Validaciones
    if (!workerId || !cashierId) {
      setError('Debes seleccionar trabajador y cashier')
      return
    }

    if (cartItems.length === 0) {
      setError('El carrito está vacío')
      return
    }

    if (saleType === 'appointment' && !appointmentId) {
      setError('Debes seleccionar una cita')
      return
    }

    setLoading(true)

    let payload: CreateFullBill | null = null

    try {
      const tatto_ids = cartItems
        .filter((item) => item.type === 'tattoo' && typeof item.tattooId === 'number')
        .map((item) => item.tattooId as number)

      const items = cartItems
        .filter((item) => item.type === 'product' && typeof item.productVariantId === 'number')
        .map((item) => ({
          product_variant_id: item.productVariantId as number,
          quantity: Math.max(1, Math.trunc(item.quantity)),
        }))

      // Calculate 18% tax and add it as an aggregate
      const baseTotal = subtotal + aggregatesTotal - discountsTotal
      const taxAmount = baseTotal * 0.18
      
      const normalizedExtra = {
        aggregates: [
          ...extra.aggregates
            .filter((agg) => agg.reason.trim().length > 0 && Number.isFinite(agg.amount) && agg.amount !== 0)
            .map((agg) => ({
              amount: agg.amount,
              reason: agg.reason.trim(),
            })),
          // Add 18% tax as automatic aggregate
          ...(taxAmount > 0 ? [{
            amount: taxAmount,
            reason: 'Impuesto (18%)',
          }] : [])
        ],
        discounts: extra.discounts
          .filter((disc) => disc.reason.trim().length > 0 && Number.isFinite(disc.amount) && disc.amount !== 0)
          .map((disc) => ({
            amount: disc.amount,
            reason: disc.reason.trim(),
          })),
      }

      const billCreateAt = new Date(date) || new Date()
      const payments = draftPayments
        .map((p) => {
          const amt = Number(p.amount)
          if (!Number.isFinite(amt) || amt <= 0) return null
          return {
            create_at: billCreateAt,
            amount: amt,
            method: p.method,
            transaction_ref: p.transaction_ref.trim() !== '' ? p.transaction_ref.trim() : null,
            is_refunded: false,
          }
        })
        .filter((row): row is NonNullable<typeof row> => row !== null)

      // Preparar payload según CreateFullBill
      payload = {
        client_id: clientId || undefined,
        worker_id: workerId,
        cashier_id: cashierId,
        appointment_id: appointmentId || undefined,
        create_at: billCreateAt,
        tatto_ids,
        items,
        payments,
        extra: normalizedExtra,
      }

      const result = await createBill(payload)

      if (!result.ok) {
        throw new Error(typeof result.error === 'string' ? result.error : result.error?.message ?? 'Error al crear factura')
      }

      openInvoicePrint({
        billId: result.data?.bill_id,
        date,
        items: [...cartItems],
        aggregates: [...extra.aggregates],
        discounts: [...extra.discounts],
        payments: [...draftPayments],
        subtotal,
        total,
        tax,
      })

      setSuccess('Factura creada exitosamente')
      setCartItems([])
      setExtra({ aggregates: [], discounts: [] })
      setDraftPayments([])
      setClientId(null)
      setSaleType('direct')
    } catch (err: any) {
      if (payload && isTransientCreateFailure(err)) {
        enqueueBill(payload)
        setError(null)
        setSuccess(
          'Sin conexión con el servidor. La factura quedó en cola y se enviará sola cuando la API responda.',
        )
        setCartItems([])
        setExtra({ aggregates: [], discounts: [] })
        setDraftPayments([])
        setClientId(null)
        setClientEmail('')
        setClientData(null)
        setSaleType('direct')
        setAppointmentId(null)
      } else {
        const axiosMsg = err?.response?.data?.error
        const fallback = err instanceof Error ? err.message : 'Error desconocido'
        setError(typeof axiosMsg === 'string' ? axiosMsg : fallback)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="checkout-form-page">
      <header className="checkout-form-header">
        <h2>Crear Factura</h2>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </header>

      {error && (
        <div className="checkout-error-banner" style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
          <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>⚠️</span>
          <span>{error}</span>
        </div>
      )}
      {success && <div className="checkout-success-banner">{success}</div>}

      <div className="checkout-form-grid">
        {/* SECCIÓN 1: TIPO DE VENTA Y CLIENTE */}
        <section className="checkout-section checkout-extras-section">
          <h3>Tipo de Venta</h3>
          <label>
            <input
              type="radio"
              value="direct"
              checked={saleType === 'direct'}
              onChange={() => setSaleType('direct')}
            />
            Venta Directa
          </label>
          <label>
            <input
              type="radio"
              value="appointment"
              checked={saleType === 'appointment'}
              onChange={() => setSaleType('appointment')}
            />
            Por Cita
          </label>

        {saleType === 'direct' && (
            <div className="checkout-form-group">
              <label>Cliente (buscar por email)</label>
              <div className="checkout-search-bar">
                <input
                  type="email"
                  placeholder="Ingresa el email del cliente"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearchClient()}
                />
                <button onClick={handleSearchClient} className="btn-search">
                  Buscar
                </button>
              </div>
              {clientData && (
                <div className="checkout-client-result">
                  <p>
                    <strong>{clientData.first_name} {clientData.last_name}</strong>
                  </p>
                  <p className="checkout-client-email">{clientData.email}</p>
                </div>
              )}
              {clientEmail && !clientData && (
                <p className="checkout-no-result">Cliente no encontrado</p>
              )}
            </div>
          )}

          {saleType === 'appointment' && (
            <div className="checkout-form-group">
              <label>Cita</label>
              <select
                value={appointmentId ?? ''}
                onChange={(e) => setAppointmentId(e.target.value ? parseInt(e.target.value) : null)}
              >
                <option value="">-- Selecciona una cita --</option>
                {appointments.filter((apt) => apt !== null).map((apt) => (
                  <option key={apt.appointment_id} value={apt.appointment_id}>
                    Cita #{apt.appointment_id} - {apt.client?.person?.first_name}{' '}
                    {apt.client?.person?.last_name} - {new Date(apt.date).toLocaleDateString()}
                  </option>
                ))}
              </select>
            </div>
          )}
        </section>

        {/* SECCIÓN 2: EMPLEADOS */}
        <section className="checkout-section">
          <h3>Empleados</h3>
          <div className="checkout-form-group">
            <label>Trabajador</label>
            {loadingData ? (
              <p className="checkout-loading">Cargando trabajadores...</p>
            ) : (
              <select
                value={workerId}
                onChange={(e) => setWorkerId(parseInt(e.target.value) || 0)}
              >
                <option value={0}>-- Selecciona un trabajador --</option>
                {workers.map((worker) => (
                  <option key={worker.worker_id} value={worker.worker_id}>
                    {worker.first_name} {worker.last_name} ({worker.specialty})
                  </option>
                ))}
              </select>
            )}
          </div>
          <div className="checkout-form-group">
            <label>Cashier</label>
            <input
              type="number"
              value={1}
              disabled
              readOnly
            />
          </div>
        </section>

        {/* SECCIÓN 3: CARRITO */}
        <section className="checkout-section checkout-cart-section">
          <div className="checkout-cart-header">
            <h3>Carrito</h3>
            <div className="checkout-cart-buttons">
              <div className="checkout-product-selector">
                <select
                  value={selectedProductVariantId}
                  onChange={(e) => setSelectedProductVariantId(parseInt(e.target.value) || 0)}
                  disabled={loadingData || productVariants.length === 0}
                >
                  <option value={0}>
                    {loadingData ? '(Cargando productos...)' : productVariants.length === 0 ? '(Sin productos disponibles)' : '-- Selecciona un producto --'}
                  </option>
                  {(productVariants as (typeof productVariants)[number][]).map((variant: any) => (
                    <option key={variant.product_variant_id} value={variant.product_variant_id}>
                      {variant.product.name} - {variant.presentation} (${Number(variant.price).toFixed(2)})
                    </option>
                  ))}
                </select>
                <button onClick={addProductToCart} className="btn-secondary" disabled={!selectedProductVariantId || loadingData}>
                  + Producto
                </button>
              </div>

              <div className="checkout-tattoo-selector">
                <select
                  value={selectedTattooId}
                  onChange={(e) => setSelectedTattooId(parseInt(e.target.value) || 0)}
                  disabled={loadingData || tattoos.length === 0}
                >
                  <option value={0}>
                    {loadingData ? '(Cargando tatuajes...)' : tattoos.length === 0 ? '(Sin tatuajes disponibles)' : '-- Selecciona un tatuaje --'}
                  </option>
                  {(tattoos as (typeof tattoos)[number][]).map((tattoo: any) => (
                    <option key={tattoo.tattoo_id} value={tattoo.tattoo_id}>
                      {tattoo.name} (${Number(tattoo.cost).toFixed(2)})
                    </option>
                  ))}
                </select>
                <button onClick={addTattooToCart} className="btn-secondary" disabled={!selectedTattooId || loadingData}>
                  + Tatuaje
                </button>
              </div>
            </div>
          </div>

          <div className="checkout-cart-items">
            {cartItems.length === 0 ? (
              <p className="checkout-empty">Sin artículos en el carrito</p>
            ) : (
              <table className="checkout-cart-table">
                <thead>
                  <tr>
                    <th>Artículo</th>
                    <th>Precio</th>
                    <th>Cantidad</th>
                    <th>Subtotal</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.id}>
                      <td>
                        {item.name} ({item.type})
                      </td>
                      <td>${item.price.toFixed(2)}</td>
                      <td>
                        {item.type === 'tattoo' ? (
                          <span className="checkout-cart-qty-na" title="Los tatuajes se facturan por unidad">
                            —
                          </span>
                        ) : (
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                            style={{ width: '60px' }}
                          />
                        )}
                      </td>
                      <td>
                        $
                        {(item.type === 'tattoo' ? item.price : item.price * item.quantity).toFixed(2)}
                      </td>
                      <td>
                        <button onClick={() => removeFromCart(item.id)} className="btn-danger">
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        {/* SECCIÓN 4: AGREGADOS Y DESCUENTOS */}
        <section className="checkout-section">
          <h3>Agregados</h3>
          {extra.aggregates.map((agg, idx) => (
            <div key={idx} className="checkout-extra-item">
              <input
                type="text"
                placeholder="Razón"
                value={agg.reason}
                onChange={(e) => {
                  const newAggs = [...extra.aggregates]
                  newAggs[idx].reason = e.target.value
                  setExtra({ ...extra, aggregates: newAggs })
                }}
              />
              <input
                type="number"
                placeholder="Monto"
                value={agg.amount}
                onChange={(e) => {
                  const newAggs = [...extra.aggregates]
                  newAggs[idx].amount = parseMoneyInput(e.target.value)
                  setExtra({ ...extra, aggregates: newAggs })
                }}
              />
              <button onClick={() => removeAggregate(idx)} className="btn-danger">
                Quitar
              </button>
            </div>
          ))}
          <button onClick={addAggregate} className="btn-secondary">
            + Agregado
          </button>
        </section>

        <section className="checkout-section checkout-extras-section">
          <h3>Descuentos</h3>
          {extra.discounts.map((disc, idx) => (
            <div key={idx} className="checkout-extra-item">
              <input
                type="text"
                placeholder="Razón"
                value={disc.reason}
                onChange={(e) => {
                  const newDiscs = [...extra.discounts]
                  newDiscs[idx].reason = e.target.value
                  setExtra({ ...extra, discounts: newDiscs })
                }}
              />
              <input
                type="number"
                placeholder="Monto"
                value={disc.amount}
                onChange={(e) => {
                  const newDiscs = [...extra.discounts]
                  newDiscs[idx].amount = parseMoneyInput(e.target.value)
                  setExtra({ ...extra, discounts: newDiscs })
                }}
              />
              <button onClick={() => removeDiscount(idx)} className="btn-danger">
                Quitar
              </button>
            </div>
          ))}
          <button onClick={addDiscount} className="btn-secondary">
            + Descuento
          </button>
        </section>

        <section className="checkout-section checkout-payments-section">
          <h3>Pagos en esta factura</h3>
          <p className="checkout-payments-hint">
            Opcional: registra abonos al crear la factura. El estado (pendiente / parcial / pagada) se actualizará en el servidor.
          </p>
          {draftPayments.length === 0 ? (
            <p className="checkout-empty checkout-empty--inline">Sin pagos agregados</p>
          ) : (
            <div className="checkout-draft-payments">
              {draftPayments.map((p) => (
                <div key={p.id} className="checkout-draft-payment-row">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Monto"
                    value={p.amount || ''}
                    onChange={(e) =>
                      updateDraftPayment(p.id, { amount: parseMoneyInput(e.target.value) })
                    }
                  />
                  <select
                    value={p.method}
                    onChange={(e) =>
                      updateDraftPayment(p.id, { method: e.target.value as PaymentMethod })
                    }
                  >
                    {(Object.keys(PAYMENT_METHOD_LABEL) as PaymentMethod[]).map((m) => (
                      <option key={m} value={m}>
                        {PAYMENT_METHOD_LABEL[m]}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Ref. transacción (opcional)"
                    value={p.transaction_ref}
                    onChange={(e) => updateDraftPayment(p.id, { transaction_ref: e.target.value })}
                  />
                  <button type="button" onClick={() => removeDraftPayment(p.id)} className="btn-danger">
                    Quitar
                  </button>
                </div>
              ))}
            </div>
          )}
          <button type="button" onClick={addDraftPayment} className="btn-secondary">
            + Pago
          </button>

          <div
            className={[
              'checkout-debt-panel',
              draftPayments.length > 0 ? 'checkout-debt-panel--active' : '',
              paymentsSum > 0 && debtRemaining === 0 && total > 0 ? 'checkout-debt-panel--settled' : '',
              paymentsSum > 0 && debtRemaining > 0 ? 'checkout-debt-panel--partial' : '',
              overpay > 0 ? 'checkout-debt-panel--overpay' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <h4>Estado de cobro</h4>
            <div className="checkout-debt-rows">
              <div className="checkout-debt-row">
                <span>Total a pagar (con impuesto)</span>
                <strong>${total.toFixed(2)}</strong>
              </div>
              <div className="checkout-debt-row">
                <span>Abonado en esta pantalla</span>
                <strong>${paymentsSum.toFixed(2)}</strong>
              </div>
              <div className="checkout-debt-row checkout-debt-row--highlight">
                <span>Deuda pendiente</span>
                <strong className={debtRemaining > 0 ? 'checkout-debt-amount--owes' : 'checkout-debt-amount--clear'}>
                  ${debtRemaining.toFixed(2)}
                </strong>
              </div>
              {overpay > 0 && (
                <div className="checkout-debt-row checkout-debt-row--overpay">
                  <span>Sobrepago (vuelto / a favor)</span>
                  <strong>${overpay.toFixed(2)}</strong>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* SECCIÓN 5: TOTALES */}
      <section className="checkout-totals">
        <div className="checkout-total-row">
          <span>Subtotal:</span>
          <strong>${subtotal.toFixed(2)}</strong>
        </div>
        <div className="checkout-total-row">
          <span>Agregados:</span>
          <strong>${aggregatesTotal.toFixed(2)}</strong>
        </div>
        <div className="checkout-total-row">
          <span>Descuentos:</span>
          <strong>-${discountsTotal.toFixed(2)}</strong>
        </div>
        <div className="checkout-total-row">
          <span>Subtotal con descuentos:</span>
          <strong>${totalAfterDiscount.toFixed(2)}</strong>
        </div>
        <div className="checkout-total-row">
          <span>Impuesto (18%):</span>
          <strong>${tax.toFixed(2)}</strong>
        </div>
        <div className="checkout-total-row checkout-total-final">
          <span>Total:</span>
          <strong>${total.toFixed(2)}</strong>
        </div>
      </section>

      {/* LABEL DE ERROR JUNTO AL BOTÓN */}
      {error && (
        <div className="checkout-error-banner" style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0' }}>
          <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* BOTÓN DE FACTURAR */}
      <button
        onClick={handleGenerateBill}
        disabled={loading || cartItems.length === 0}
        className="checkout-btn-generate"
      >
        {loading ? 'Procesando...' : 'Facturar'}
      </button>
    </div>
  )
}

export default CheckoutFormPage
