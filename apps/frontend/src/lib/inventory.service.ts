import { api } from './api'

export type InventoryItem = {
  inventory_item_id: number
  product_variant_id: number
  batch_number: string
  current_quantity: number
  expiry_date: string | null
}

export type StockMovement = {
  stock_movement_id: number
  inventory_item_id: number
  type: 'entry' | 'exit' | 'waste'
  quantity: number
  reason: string | null
  create_at: string
  inventoryItem: InventoryItem
  billDetails: unknown[]
}

export const inventoryService = {
  /** GET /api/inventory */
  getOne: (inventory_item_id: number, gte?: number) =>
    api.get<InventoryItem>('/inventory', { inventory_item_id, gte }),

  /** GET /api/inventory/total-quantity */
  getTotalQuantity: (product_variant_id: number) =>
    api.get<number>('/inventory/total-quantity', { product_variant_id }),

  /** GET /api/inventory/not-expired */
  getNotExpired: (product_variant_id: number, gte?: number) =>
    api.get<InventoryItem[]>('/inventory/not-expired', { product_variant_id, gte }),

  /** GET /api/inventory/not-expired-list */
  getNotExpiredList: (product_variant_id: number, gte?: number) =>
    api.get<InventoryItem[]>('/inventory/not-expired-list', { product_variant_id, gte }),

  /** POST /api/inventory */
  create: (data: {
    product_variant_id: number
    batch_number: string
    current_quantity: number
    expiry_date?: string
  }) => api.post<InventoryItem>('/inventory', data),
}

export const stockMovementService = {
  /** GET /api/stock-movements/detail */
  getOne: (filters: {
    stock_movement_id?: number
    inventory_item_id?: number
    type?: 'entry' | 'exit' | 'waste'
    create_at?: string
    quantity?: number
  }) => api.get<StockMovement>('/stock-movements/detail', filters as Record<string, unknown>),
}
