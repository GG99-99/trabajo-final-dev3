import { useState, useEffect } from 'react'
import { CreateFullBill } from '@final/shared'
import type { WorkerPublic, AppointmentWithRelation, ClientPublic, ProductVariantWithRelations, TattoWithImg } from '@final/shared'
import { createBill, getWorkers, getAppointments, searchClientByEmail, getAllProductVariants, getAllTattoos } from '../services'

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

function CheckoutFormPage() {
  const [saleType, setSaleType] = useState<'direct' | 'appointment'>('direct')
  const [clientId, setClientId] = useState<number | null>(null)
  const [clientEmail, setClientEmail] = useState<string>('')
  const [workerId, setWorkerId] = useState<number>(0)
  const [cashierId] = useState<number>(1)
  const [appointmentId, setAppointmentId] = useState<number | null>(null)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [extra, setExtra] = useState<Extra>({
    aggregates: [],
    discounts: [],
  })
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
          setProductVariants(variantsRes.data)
        }
        if (tattoosRes.ok && tattoosRes.data) {
          setTattoos(tattoosRes.data)
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
  const aggregatesTotal = extra.aggregates.reduce((sum, agg) => sum + agg.amount, 0)
  const discountsTotal = extra.discounts.reduce((sum, disc) => sum + disc.amount, 0)
  const total = subtotal + aggregatesTotal - discountsTotal

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

      const normalizedExtra = {
        aggregates: extra.aggregates
          .filter((agg) => agg.reason.trim().length > 0 && Number.isFinite(agg.amount) && agg.amount !== 0)
          .map((agg) => ({
            amount: agg.amount,
            reason: agg.reason.trim(),
          })),
        discounts: extra.discounts
          .filter((disc) => disc.reason.trim().length > 0 && Number.isFinite(disc.amount) && disc.amount !== 0)
          .map((disc) => ({
            amount: disc.amount,
            reason: disc.reason.trim(),
          })),
      }

      // Preparar payload según CreateFullBill
      const payload: CreateFullBill = {
        client_id: clientId || undefined,
        worker_id: workerId,
        cashier_id: cashierId,
        appointment_id: appointmentId || undefined,
        create_at: new Date(),
        tatto_ids,
        items,
        extra: normalizedExtra,
      }

      const result = await createBill(payload)

      if (!result.ok) {
        throw new Error(result.error?.message ?? 'Error al crear factura')
      }

      setSuccess('Factura creada exitosamente')
      setCartItems([])
      setExtra({ aggregates: [], discounts: [] })
      setClientId(null)
      setSaleType('direct')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="checkout-form-page">
      <header className="checkout-form-header">
        <h2>Crear Factura</h2>
      </header>

      {error && <div className="checkout-error-banner">{error}</div>}
      {success && <div className="checkout-success-banner">{success}</div>}

      <div className="checkout-form-grid">
        {/* SECCIÓN 1: TIPO DE VENTA Y CLIENTE */}
        <section className="checkout-section">
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
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                          style={{ width: '60px' }}
                        />
                      </td>
                      <td>${(item.price * item.quantity).toFixed(2)}</td>
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
                  newAggs[idx].amount = parseFloat(e.target.value) || 0
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

        <section className="checkout-section">
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
                  newDiscs[idx].amount = parseFloat(e.target.value) || 0
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
        <div className="checkout-total-row checkout-total-final">
          <span>Total:</span>
          <strong>${total.toFixed(2)}</strong>
        </div>
      </section>

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
