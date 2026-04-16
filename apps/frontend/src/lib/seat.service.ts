import { api } from './api'

export type Seat = {
  seat_id: number
  seat_code: string
  created_at: string
  is_deleted: boolean
  schedules: unknown[]
}

export type GetSeatFilters = {
  seat_id?: number
  seat_code?: string
  is_deleted?: boolean
}

export const seatService = {
  /** GET /api/seats */
  getMany: (filters?: GetSeatFilters) =>
    api.get<Seat[]>('/seats', filters as Record<string, unknown>),

  /** GET /api/seats/detail */
  getOne: (filters?: GetSeatFilters) =>
    api.get<Seat>('/seats/detail', filters as Record<string, unknown>),
}
