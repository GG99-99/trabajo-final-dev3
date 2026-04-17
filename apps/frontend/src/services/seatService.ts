import apiClient from '../lib/apiClient.js';

export type Seat = {
  seat_id: number;
  name: string;
  description?: string;
  create_at: string;
  is_deleted: boolean;
  schedules?: any[];
};

export const seatService = {
  async getMany(): Promise<Seat[]> {
    const response = await apiClient.get('/seats');
    return response.data.data;
  },
};