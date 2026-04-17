import apiClient from '../lib/apiClient.js';
import type { GetManyCategory, GetCategory, CreateCategory, CategoryWithRelations } from '@final/shared';

export const categoryService = {
  async getMany(filters?: GetManyCategory): Promise<CategoryWithRelations[]> {
    const response = await apiClient.get('/categories', { params: filters });
    return response.data.data;
  },

  async getDetail(filters: GetCategory): Promise<CategoryWithRelations> {
    const response = await apiClient.get('/categories/detail', { params: filters });
    return response.data.data;
  },

  async create(category: CreateCategory): Promise<CategoryWithRelations> {
    const response = await apiClient.post('/categories', category);
    return response.data.data;
  },
};