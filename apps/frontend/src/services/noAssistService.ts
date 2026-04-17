import apiClient from '../lib/apiClient.js';

export type NoAssist = {
  no_assist_id: number;
  worker_id: number;
  reason: string;
  date: string;
  create_at: string;
  is_deleted: boolean;
  worker?: any;
};

export const noAssistService = {
  async getMany(): Promise<NoAssist[]> {
    const response = await apiClient.get('/no-assists');
    return response.data.data;
  },
};