import apiClient from '../lib/apiClient.js';
import type { CreateAppointment, GetAppointmentFilters, GetBlocks } from '@final/shared';

export type Appointment = {
  appointment_id: number;
  worker_id: number;
  client_id: number;
  tattoo_id: number;
  start: string;
  end: string;
  date: string;
  create_at: string;
  is_deleted: boolean;
  status: 'pending' | 'completed' | 'expired' | 'cancelled';
  worker?: any;
  client?: any;
  tattoo?: any;
  bill?: any;
};

export type AppointmentBlockTime = {
  start: string;
  end: string;
  duration: string;
};

export const appointmentService = {
  async getMany(filters?: GetAppointmentFilters): Promise<Appointment[]> {
    const response = await apiClient.get('/appointments', { params: filters });
    return response.data.data;
  },

  async getBlocks(filters: GetBlocks): Promise<AppointmentBlockTime[]> {
    const response = await apiClient.get('/appointments/blocks', { params: filters });
    return response.data.data;
  },

  async create(appointment: CreateAppointment): Promise<Appointment> {
    const response = await apiClient.post('/appointments', appointment);
    return response.data.data;
  },

  async updateStatus(appointment_id: number, status: string): Promise<Appointment> {
    const response = await apiClient.put('/appointments/status', { appointment_id, status });
    return response.data.data;
  },
};