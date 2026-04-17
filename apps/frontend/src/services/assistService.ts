import apiClient from '../lib/apiClient.js';

export type Assist = {
  assist_id: number;
  worker_id: number;
  attendance_id: number;
  alert: boolean;
  create_at: string;
  is_deleted: boolean;
  worker?: any;
  attendance?: any;
};

export const assistService = {
  async getMany(): Promise<Assist[]> {
    const response = await apiClient.get('/assists');
    return response.data.data;
  },
};