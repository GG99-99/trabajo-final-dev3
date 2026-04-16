import { api } from './api'

export type BillStatus = 'pending' | 'paid' | 'cancelled'
export type PaymentMethod = 'cash' | 'credit_card' | 'transfer'

export type Bill = {
  bill_id: number
  client_id: number
  worker_id: number
  cashier_id: number
  create_at: string
  status: BillStatus
  details: unknown[]
  tattoos: unknown[]
  payments: Payment[]
  aggregates: unknown[]
  discounts: unknown[]
}

export type Payment = {
  payment_id: number
  bill_id: number
  create_at: string
  amount: number
  method: PaymentMethod
  transaction_ref: string
}

export type BillProductItem = {
  product_name: string
  presentation: string
  price: number
  stock_movement_quantity: number
  inventory_item_id: number
}

export type BillTattooItem = {
  tattoo_id: number
  price: number
}

export type GetManyBill = {
  date?: string
  status?: BillStatus
  client_id?: number
  cashier_id?: number
  relations?: boolean
}

export type CreateFullBill = {
  client_id: number
  worker_id: number
  cashier_id: number
  create_at: string
  tatto_ids: number[]
  items: { product_variant_id: number; quantity: number }[]
  extra: {
    aggregates: { amount: number; reason: string }[]
    discounts:  { amount: number; reason: string }[]
  }
}

export type CreatePayment = {
  bill_id: number
  amount: number | string
  method: PaymentMethod
  transaction_ref: string
}

export const billService = {
  /** GET /api/bills */
  getMany: (filters?: GetManyBill) =>
    api.get<Bill[]>('/bills', filters as Record<string, unknown>),

  /** GET /api/bills/detail */
  getOne: (bill_id: number, relations?: boolean) =>
    api.get<Bill>('/bills/detail', { bill_id, relations }),

  /** GET /api/bills/total */
  getTotal: (bill_id: number) =>
    api.get<number>('/bills/total', { bill_id }),

  /** GET /api/bills/stock-movements */
  getStockMovements: (bill_id: number) =>
    api.get<BillProductItem[]>('/bills/stock-movements', { bill_id }),

  /** GET /api/bills/tattoos */
  getTattoos: (bill_id: number) =>
    api.get<BillTattooItem[]>('/bills/tattoos', { bill_id }),

  /** POST /api/bills */
  create: (data: CreateFullBill) =>
    api.post<Bill>('/bills', data),
}

export const paymentService = {
  /** GET /api/payments */
  getMany: (filters?: { bill_id?: number; date?: string; relations?: boolean }) =>
    api.get<Payment[]>('/payments', filters as Record<string, unknown>),

  /** GET /api/payments/detail */
  getOne: (payment_id: number) =>
    api.get<Payment>('/payments/detail', { payment_id }),

  /** GET /api/payments/by-month */
  getByMonth: (year: number, month: number) =>
    api.get<Payment[]>('/payments/by-month', { year, month }),

  /** POST /api/payments */
  create: (data: CreatePayment) =>
    api.post<Payment & { bill: unknown }>('/payments', data),
}
