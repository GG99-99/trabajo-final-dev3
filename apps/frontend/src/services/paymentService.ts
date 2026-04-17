import apiClient from '../lib/apiClient.js';

export type Payment = {
  payment_id: number;
  bill_id: number;
  amount: number;
  payment_method: string;
  payment_date: string;
  create_at: string;
  is_deleted: boolean;
  bill?: any;
};

export const paymentService = {
  async getMany(): Promise<Payment[]> {
    const response = await apiClient.get('/payments');
    return response.data.data;
  },

  async getByMonth(): Promise<Payment[]> {
    const response = await apiClient.get('/payments/month');
    return response.data.data;
  },
};