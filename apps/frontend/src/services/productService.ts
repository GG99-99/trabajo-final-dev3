import apiClient from '../lib/apiClient.js';
import type { GetManyProduct, GetProduct, CreateProduct, ProductWithRelations } from '@final/shared';

export const productService = {
  async getMany(filters?: GetManyProduct): Promise<ProductWithRelations[]> {
    const response = await apiClient.get('/products', { params: filters });
    return response.data.data;
  },

  async getDetail(filters: GetProduct): Promise<ProductWithRelations> {
    const response = await apiClient.get('/products/detail', { params: filters });
    return response.data.data;
  },

  async create(product: CreateProduct): Promise<ProductWithRelations> {
    const response = await apiClient.post('/products', product);
    return response.data.data;
  },
};