# Checkout App

Aplicación React para facturación en tiempo real. Migrada del formulario Windows (`FrmCheckout`) a React con tipos compartidos desde `@final/shared`.

## Características

- ✅ Crear facturas completas con el tipo `CreateFullBill`
- ✅ Selección de tipo de venta (directa o por cita)
- ✅ Carrito de artículos con productos y tatuajes
- ✅ Cálculo automático de subtotal, impuestos (ITBIS 18%) y total
- ✅ Agregados y descuentos personalizados
- ✅ Validación de campos antes de facturar
- ✅ Integración con servicios axios tipados

## Estructura

```
src/
├── pages/
│   ├── CheckoutFormPage.tsx    # Página principal del formulario
│   └── CheckoutPage.tsx        # Página de listado (opcional)
├── services/
│   ├── apiClient.ts            # Cliente axios configurado
│   ├── billService.ts          # Servicios de facturas
│   ├── paymentService.ts       # Servicios de pagos
│   └── index.ts                # Exporta checkoutService
├── App.tsx
├── main.tsx
└── index.css
```

## Instalación

```bash
cd apps/checkout
pnpm install
```

## Desarrollo

```bash
pnpm dev
```

La app correrá en `http://localhost:5173`

## Build

```bash
pnpm build
```

## Variables de entorno

Crear un archivo `.env.local`:

```env
VITE_API_URL=http://localhost:4000
```

## Tipos utilizados

- `CreateFullBill` - Crear factura completa con artículos y tatuajes
- `BillWithRelations` - Factura con relaciones completas
- `CreatePayment` - Crear pago
- `PaymentWithRelations` - Pago con relaciones

Todos importados desde `@final/shared`.

## Servicios

### billService

```typescript
import { createFullBill, listBills } from '../services'

// Crear factura completa
const result = await createFullBill({
  client_id: 1,
  worker_id: 2,
  cashier_id: 3,
  create_at: new Date(),
  tatto_ids: [1, 2],
  items: [{ product_variant_id: 1, quantity: 2 }],
  extra: {
    aggregates: [],
    discounts: [],
  },
})

// Listar facturas
const bills = await listBills()
```

### paymentService

```typescript
import { createPayment, listPayments } from '../services'
```

## Validaciones

- El carrito debe contener al menos un artículo
- Debe seleccionarse un trabajador
- Debe seleccionarse un cashier
- Si es por cita, debe seleccionarse una cita

## Estructura de datos

### Extra (Agregados y Descuentos)

```typescript
interface Extra {
  aggregates: { amount: number; reason: string }[]
  discounts: { amount: number; reason: string }[]
}
```

### CartItem

```typescript
interface CartItem {
  id: string
  type: 'product' | 'tattoo'
  name: string
  price: number
  quantity: number
  productVariantId?: number
  tattooId?: number
}
```

## Cálculos

- **Subtotal**: Suma de (precio × cantidad) de todos los artículos
- **Agregados**: Suma de montos agregados
- **Descuentos**: Suma de montos descontados
- **Taxable**: Subtotal + Agregados - Descuentos
- **Impuestos**: Taxable × 0.18 (ITBIS 18%)
- **Total**: Taxable + Impuestos
