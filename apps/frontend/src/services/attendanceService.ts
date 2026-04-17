import apiClient from '../lib/apiClient.js';

export type Attendance = {
  attendance_id: number;
  worker_id: number;
  check_in: string;
  check_out?: string;
  date: string;
  create_at: string;
  is_deleted: boolean;
  worker?: any;
};

export const attendanceService = {
  async getMany(): Promise<Attendance[]> {
    const response = await apiClient.get('/attendances');
    return response.data.data;
  },
};