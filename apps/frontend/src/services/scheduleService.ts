import apiClient from '../lib/apiClient.js';
import type { GetManySchedules, CreateSchedule, ScheduleDayOfWeek } from '@final/shared';

export type Schedule = {
  schedule_id: number;
  worker_id: number;
  seat_id: number;
  day_of_week: string;
  start_time: string;
  end_time: string;
  active: boolean;
  create_at: string;
  is_deleted: boolean;
  worker?: any;
  seat?: any;
};

export const scheduleService = {
  async getMany(filters?: GetManySchedules): Promise<Schedule[]> {
    const response = await apiClient.get('/schedules', { params: filters });
    return response.data.data;
  },

  async getActive(worker_id: number): Promise<Schedule[]> {
    const response = await apiClient.get('/schedules/active', { params: { worker_id } });
    return response.data.data;
  },

  async getDayByWorker(worker_id: number, day: ScheduleDayOfWeek): Promise<Schedule> {
    const response = await apiClient.get('/schedules/day-worker', { params: { worker_id, day } });
    return response.data.data;
  },

  async create(schedule: CreateSchedule): Promise<Schedule> {
    const response = await apiClient.post('/schedules', schedule);
    return response.data.data;
  },

  async inactive(schedule_id: number): Promise<Schedule> {
    const response = await apiClient.put('/schedules/inactive', { schedule_id });
    return response.data.data;
  },
};