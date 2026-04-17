import apiClient from '../lib/apiClient.js';
import type { GetInventoryFilters, GetQuantityInventoryFilters, GetNotExpired, CreateInventoryItem, UpdateQuantity } from '@final/shared';

export type InventoryItem = {
  inventory_item_id: number;
  product_variant_id: number;
  batch_number: string;
  current_quantity: number;
  expiry_date?: string;
  create_at: string;
  is_deleted: boolean;
  product_variant?: any;
};

export const inventoryService = {
  async get(filters: GetInventoryFilters): Promise<InventoryItem[]> {
    const response = await apiClient.get('/inventory', { params: filters });
    return response.data.data;
  },

  async getTotalQuantity(filters: GetQuantityInventoryFilters): Promise<number> {
    const response = await apiClient.get('/inventory/total', { params: filters });
    return response.data.data;
  },

  async getNotExpired(filters: GetNotExpired): Promise<InventoryItem[]> {
    const response = await apiClient.get('/inventory/not-expired', { params: filters });
    return response.data.data;
  },

  async getNotExpiredList(filters: GetNotExpired): Promise<InventoryItem[]> {
    const response = await apiClient.get('/inventory/not-expired-list', { params: filters });
    return response.data.data;
  },

  async create(item: CreateInventoryItem): Promise<InventoryItem> {
    const response = await apiClient.post('/inventory', item);
    return response.data.data;
  },

  async updateQuantity(updateData: UpdateQuantity): Promise<InventoryItem> {
    const response = await apiClient.put('/inventory/quantity', updateData);
    return response.data.data;
  },
};