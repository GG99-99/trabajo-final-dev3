import apiClient from '../lib/apiClient.js';

export type Cashier = {
  cashier_id: number;
  person_id: number;
  create_at: string;
  is_deleted: boolean;
  person?: any;
};

export const cashierService = {
  async getMany(): Promise<Cashier[]> {
    const response = await apiClient.get('/cashiers');
    return response.data.data;
  },
};