import { api } from './api'

export type NoAssist = {
  no_assist_id: number
  attendance_id: number
  worker_id: number
  create_at: string
  is_deleted: boolean
  attendance: unknown
  worker: unknown
}

export type GetNoAssistFilters = {
  no_assist_id?: number
  attendance_id?: number
  worker_id?: number
  is_deleted?: boolean
}

export const noAssistService = {
  /** GET /api/no-assists */
  getMany: (filters?: GetNoAssistFilters) =>
    api.get<NoAssist[]>('/no-assists', filters as Record<string, unknown>),

  /** GET /api/no-assists/detail */
  getOne: (filters?: GetNoAssistFilters) =>
    api.get<NoAssist>('/no-assists/detail', filters as Record<string, unknown>),

  /** POST /api/no-assists */
  create: (data: {
    attendance_id: number
    worker_id: number
    create_at?: string
    is_deleted?: boolean
  }) => api.post<NoAssist>('/no-assists', data),
}
