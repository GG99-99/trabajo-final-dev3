import type { WorkerPublic, CashierWithPerson, ClientPublic } from '@final/shared'
import { api } from './api'

// ── Workers ────────────────────────────────────────────────────────────────

export type WorkerWithPerson = {
  worker_id: number
  person_id: number
  specialty: string
  person: {
    person_id: number
    first_name: string
    last_name: string
    email: string
    password: string | null
    type: string
    tag?: string | null
  }
}

export const workerService = {
  /** GET /api/workers */
  getAll: () => api.get<WorkerPublic[]>('/workers'),

  /** GET /api/workers/detail?worker_id= */
  getOne: (worker_id: number) =>
    api.get<WorkerWithPerson>('/workers/detail', { worker_id }),
}

// ── Clients ────────────────────────────────────────────────────────────────

export const clientService = {
  /** GET /api/clients */
  getAll: () => api.get<ClientPublic[]>('/clients'),

  /** GET /api/clients/detail?client_id= */
  getOne: (client_id: number) =>
    api.get<ClientPublic>('/clients/detail', { client_id }),

  /** POST /api/clients */
  create: (data: {
    first_name: string; last_name: string; email: string
    password: string; type: 'client'; medical_notes?: string
  }) => api.post<ClientPublic>('/clients', data),

  /** DELETE /api/clients/:id — soft delete */
  softDelete: (client_id: number) =>
    api.delete<boolean>(`/clients/${client_id}`),
}

// ── Cashiers ───────────────────────────────────────────────────────────────

export const cashierService = {
  /** GET /api/cashiers */
  getAll: () => api.get<CashierWithPerson[]>('/cashiers'),

  /** GET /api/cashiers/detail?cashier_id= */
  getOne: (cashier_id: number) =>
    api.get<CashierWithPerson>('/cashiers/detail', { cashier_id }),

  /** POST /api/cashiers */
  create: (data: {
    first_name: string; last_name: string; email: string
    password: string; type: 'cashier'
  }) => api.post<CashierWithPerson>('/cashiers', data),
}

// ── Persons (generic — used for settings/admin) ───────────────────────────

export type PersonFull = {
  person_id: number
  first_name: string
  last_name: string
  email: string
  type: 'client' | 'worker' | 'cashier'
  tag?: string | null
  is_deleted: boolean
  worker?:  { worker_id: number; specialty: string } | null
  client?:  { client_id: number; medical_notes: string | null } | null
  cashier?: { cashier_id: number } | null
}

export type UpdatePersonPayload = {
  person_id: number
  first_name?: string
  last_name?: string
  email?: string
  password?: string
  specialty?: string
  medical_notes?: string
}

export const personService = {
  /** GET /api/persons/detail */
  getOne: (filters: { person_id?: number; email?: string; noPass: boolean }) =>
    api.get<PersonFull>('/persons/detail', filters as Record<string, unknown>),

  /** GET /api/persons/all */
  getAll: () => api.get<PersonFull[]>('/persons/all'),

  /** POST /api/persons */
  create: (data: {
    first_name: string; last_name: string; email: string; password: string
    type: 'client' | 'worker' | 'cashier'
    specialty?: 'realism' | 'cartoon' | 'other'
    medical_notes?: string
  }) => api.post<PersonFull>('/persons', data),

  /** PUT /api/persons/update */
  update: (data: UpdatePersonPayload) =>
    api.put<PersonFull>('/persons/update', data),

  /** PUT /api/persons/ban  — toggle ban */
  ban: (person_id: number, banned: boolean) =>
    api.put<PersonFull>('/persons/ban', { person_id, banned }),

  /** DELETE /api/persons/:id — hard soft-delete */
  softDelete: (person_id: number) =>
    api.delete<boolean>(`/persons/${person_id}`),
}
