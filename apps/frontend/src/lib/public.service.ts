import { api } from './api'
import type { Tattoo } from './tattoo.service'
import type { AppointmentBlockTime } from '@final/shared'

export type PublicWorker = {
  worker_id: number
  first_name: string
  last_name: string
  specialty: string
}

export type BookingPayload = {
  email: string
  first_name: string
  last_name: string
  medical_notes?: string
  worker_id: number
  tattoo_id: number
  date: string
  start: string
  end: string
}

export const publicService = {
  getTattoos: () => api.get<Tattoo[]>('/public/tattoos'),
  getWorkers: () => api.get<PublicWorker[]>('/public/workers'),
  checkEmail: (email: string) =>
    api.get<{ exists: boolean; blocked?: boolean; reason?: string; first_name?: string; last_name?: string; client_id?: number }>('/public/check-email', { email }),
  getBlocks:  (worker_id: number, date: string) =>
    api.get<AppointmentBlockTime[]>('/public/blocks', { worker_id, date }),
  book: (data: BookingPayload) =>
    api.post<unknown>('/public/book', data),
}
