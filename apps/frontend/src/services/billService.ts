import apiClient from '../lib/apiClient.js';
import type { GetManyBill, GetBill, CreateFullBill, UpdateBillStatus, BillWithRelations } from '@final/shared';

export const billService = {
  async getMany(filters?: GetManyBill): Promise<BillWithRelations[]> {
    const response = await apiClient.get('/bills', { params: filters });
    return response.data.data;
  },

  async getDetail(filters: GetBill): Promise<BillWithRelations> {
    const response = await apiClient.get('/bills/detail', { params: filters });
    return response.data.data;
  },

  async getTotal(bill_id: number): Promise<any> {
    const response = await apiClient.get('/bills/total', { params: { bill_id } });
    return response.data.data;
  },

  async getStockMovements(bill_id: number): Promise<any[]> {
    const response = await apiClient.get('/bills/stock-movements', { params: { bill_id } });
    return response.data.data;
  },

  async getTattoos(bill_id: number): Promise<any[]> {
    const response = await apiClient.get('/bills/tattoos', { params: { bill_id } });
    return response.data.data;
  },

  async create(bill: CreateFullBill): Promise<BillWithRelations> {
    const response = await apiClient.post('/bills', bill);
    return response.data.data;
  },

  async updateState(updateData: UpdateBillStatus): Promise<BillWithRelations> {
    const response = await apiClient.put('/bills/state', updateData);
    return response.data.data;
  },
};