import apiClient from '../lib/apiClient.js';

export type Worker = {
  worker_id: number;
  person_id: number;
  create_at: string;
  is_deleted: boolean;
  person?: any;
};

export const workerService = {
  async getMany(): Promise<Worker[]> {
    const response = await apiClient.get('/workers');
    return response.data.data;
  },

  async getDetail(worker_id: number): Promise<Worker> {
    const response = await apiClient.get('/workers/detail', { params: { worker_id } });
    return response.data.data;
  },
};