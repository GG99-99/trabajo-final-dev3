import apiClient from '../lib/apiClient.js';

export type Image = {
  img_id: number;
  tattoo_id: number;
  url: string;
  description?: string;
  create_at: string;
  is_deleted: boolean;
  tattoo?: any;
};

export const imageService = {
  async getMany(): Promise<Image[]> {
    const response = await apiClient.get('/imgs');
    return response.data.data;
  },
};