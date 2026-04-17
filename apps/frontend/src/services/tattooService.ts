import apiClient from '../lib/apiClient.js';

export type Tattoo = {
  tattoo_id: number;
  name: string;
  description?: string;
  price: number;
  duration_minutes: number;
  create_at: string;
  is_deleted: boolean;
  images?: any[];
  appointments?: any[];
};

export const tattooService = {
  async getMany(): Promise<Tattoo[]> {
    const response = await apiClient.get('/tattoos');
    return response.data.data;
  },
};