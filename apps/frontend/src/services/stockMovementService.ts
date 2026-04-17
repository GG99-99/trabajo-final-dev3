import apiClient from '../lib/apiClient.js';

export type StockMovement = {
  stock_movement_id: number;
  inventory_item_id: number;
  quantity: number;
  type: string;
  reason?: string;
  create_at: string;
  is_deleted: boolean;
  inventory_item?: any;
};

export const stockMovementService = {
  async getMany(): Promise<StockMovement[]> {
    const response = await apiClient.get('/stock-movements');
    return response.data.data;
  },
};