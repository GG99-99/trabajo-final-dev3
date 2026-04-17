import apiClient from '../lib/apiClient.js';
import type { ClientCreate, ClientWithRelations } from '@final/shared';

export const clientService = {
  async getMany(): Promise<ClientWithRelations[]> {
    const response = await apiClient.get('/clients');
    return response.data.data;
  },

  async getDetail(client_id: number): Promise<ClientWithRelations> {
    const response = await apiClient.get('/clients/detail', { params: { client_id } });
    return response.data.data;
  },

  async create(client: ClientCreate): Promise<ClientWithRelations> {
    const response = await apiClient.post('/clients', client);
    return response.data.data;
  },
};