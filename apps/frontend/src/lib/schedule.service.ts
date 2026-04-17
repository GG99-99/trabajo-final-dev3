import type { ScheduleCreate, ScheduleJsonDay, ScheduleDayOfWeek } from '@final/shared'
import { api } from './api'

export type Schedule = {
  schedule_id: number
  worker_id: number
  seat_id: number
  created_at: string
  monday: ScheduleJsonDay
  tuesday: ScheduleJsonDay
  wednesday: ScheduleJsonDay
  thursday: ScheduleJsonDay
  friday: ScheduleJsonDay
  saturday: ScheduleJsonDay
  sunday: ScheduleJsonDay
  valid_until: string | null
  active: boolean
}

export const scheduleService = {
  /** GET /api/schedules */
  getMany: (filters?: { worker_id?: number; seat_id?: number; active?: boolean }) =>
    api.get<Schedule[]>('/schedules', filters as Record<string, unknown>),

  /** GET /api/schedules/active?worker_id= */
  getActive: (worker_id: number) =>
    api.get<Schedule>('/schedules/active', { worker_id }),

  /** GET /api/schedules/day?worker_id=&day= */
  getDay: (worker_id: number, day: ScheduleDayOfWeek) =>
    api.get<Schedule>('/schedules/day', { worker_id, day }),

  /** POST /api/schedules */
  create: (data: ScheduleCreate) =>
    api.post<Schedule>('/schedules', data),

  /** PUT /api/schedules/inactive */
  setInactive: (schedule_id: number) =>
    api.put<Schedule>('/schedules/inactive', { schedule_id }),
}
