import apiClient from '../lib/apiClient.js';
import type { GetManyProductVariant, GetProductVariant, CreateProductVariant, ProductVariantWithRelations } from '@final/shared';

export const productVariantService = {
  async getMany(filters?: GetManyProductVariant): Promise<ProductVariantWithRelations[]> {
    const response = await apiClient.get('/product-variants', { params: filters });
    return response.data.data;
  },

  async getDetail(filters: GetProductVariant): Promise<ProductVariantWithRelations> {
    const response = await apiClient.get('/product-variants/detail', { params: filters });
    return response.data.data;
  },

  async create(variant: CreateProductVariant): Promise<ProductVariantWithRelations> {
    const response = await apiClient.post('/product-variants', variant);
    return response.data.data;
  },
};