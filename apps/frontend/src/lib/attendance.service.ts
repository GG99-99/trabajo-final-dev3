import { api } from './api'

export type Attendance = {
  attendance_id: number
  status: boolean
  day: string
  work_date: string
  is_deleted: boolean
  assists: unknown[]
  noAssists: unknown[]
}

export type GetAttendanceFilters = {
  attendance_id?: number
  work_date?: string
  status?: boolean
  day?: string
  is_deleted?: boolean
}

export type CreateAttendance = {
  day: string
  work_date: string
  status?: boolean
}

export const attendanceService = {
  /** GET /api/attendances */
  getMany: (filters?: GetAttendanceFilters) =>
    api.get<Attendance[]>('/attendances', filters as Record<string, unknown>),

  /** GET /api/attendances/detail */
  getOne: (filters?: GetAttendanceFilters) =>
    api.get<Attendance>('/attendances/detail', filters as Record<string, unknown>),

  /** POST /api/attendances */
  create: (data: CreateAttendance) =>
    api.post<Attendance>('/attendances', data),
}
