import type { AppointmentCreate, AppointmentBlockTime } from '@final/shared'
import { api } from './api'

export type AppointmentStatus = 'pending' | 'completed' | 'expired' | 'cancelled'

export type Appointment = {
  appointment_id: number
  worker_id: number
  client_id: number
  tattoo_id: number
  start: string
  end: string
  date: string
  create_at: string
  is_deleted: boolean
  status: AppointmentStatus
}

export type GetAppointmentFilters = {
  appointment_id?: number
  worker_id?: number
  client_id?: number
  tattoo_id?: number
  start?: string
  end?: string
  date?: string
  status?: AppointmentStatus
}

export const appointmentService = {
  /** GET /api/appointments */
  getMany: (filters?: GetAppointmentFilters) =>
    api.get<Appointment[]>('/appointments', filters as Record<string, unknown>),

  /** GET /api/appointments/blocks */
  getBlocks: (worker_id: number, date: string) =>
    api.get<AppointmentBlockTime[]>('/appointments/blocks', { worker_id, date }),

  /** POST /api/appointments */
  create: (data: AppointmentCreate) =>
    api.post<Appointment>('/appointments', data),

  /** PUT /api/appointments/status */
  updateStatus: (appointment_id: number, status: AppointmentStatus) =>
    api.put<unknown>('/appointments/status', { appointment_id, status }),
}
