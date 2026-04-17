import apiClient from '../lib/apiClient.js';
import type { GetProvider, CreateProvider } from '@final/shared';

export type Provider = {
  provider_id: number;
  name: string;
  contact_info?: string;
  address?: string;
  create_at: string;
  is_deleted: boolean;
  products?: any[];
};

export const providerService = {
  async getMany(): Promise<Provider[]> {
    const response = await apiClient.get('/providers');
    return response.data.data;
  },

  async getDetail(filters: GetProvider): Promise<Provider> {
    const response = await apiClient.get('/providers/detail', { params: filters });
    return response.data.data;
  },

  async create(provider: CreateProvider): Promise<Provider> {
    const response = await apiClient.post('/providers', provider);
    return response.data.data;
  },
};