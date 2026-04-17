import { api } from './api'

export type Assist = {
  worker_id: number
  attendance_id: number
  start: string
  close: string | null
  alert: boolean
  alert_text: string | null
  is_deleted: boolean
  worker?: unknown
  attendance?: unknown
}

export type GetAssistFilters = {
  worker_id?: number
  attendance_id?: number
  alert?: boolean
  is_deleted?: boolean
}

export type CreateAssist = {
  worker_id: number
  attendance_id: number
  start: string
  close?: string
  alert?: boolean
  alert_text?: string
  is_deleted?: boolean
}

export const assistService = {
  /** GET /api/assists */
  getMany: (filters?: GetAssistFilters) =>
    api.get<Assist[]>('/assists', filters as Record<string, unknown>),

  /** GET /api/assists/detail */
  getOne: (filters?: GetAssistFilters) =>
    api.get<Assist>('/assists/detail', filters as Record<string, unknown>),

  /** POST /api/assists */
  create: (data: CreateAssist) =>
    api.post<Assist>('/assists', data),
}
