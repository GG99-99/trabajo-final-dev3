import type { WorkerPublic, CashierWithPerson, ClientWithPerson } from '@final/shared'
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
  getAll: () => api.get<ClientWithPerson[]>('/clients'),

  /** GET /api/clients/detail?client_id= */
  getOne: (client_id: number) =>
    api.get<ClientWithPerson>('/clients/detail', { client_id }),

  /** POST /api/clients */
  create: (data: {
    first_name: string; last_name: string; email: string
    password: string; type: 'client'; medical_notes?: string
  }) => api.post<ClientWithPerson>('/clients', data),

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

// ── Persons ────────────────────────────────────────────────────────────────

export type Person = {
  person_id: number
  first_name: string
  last_name: string
  email: string
  password: string | null
  type: 'client' | 'worker' | 'cashier'
}

export const personService = {
  /** GET /api/persons/detail */
  getOne: (filters: { person_id?: number; email?: string; noPass: boolean }) =>
    api.get<Person>('/persons/detail', filters as Record<string, unknown>),

  /** POST /api/persons */
  create: (data: {
    first_name: string; last_name: string; email: string; password: string
    type: 'client' | 'worker' | 'cashier'
    specialty?: 'realism' | 'cartoon' | 'other'
    medical_notes?: string
  }) => api.post<Person>('/persons', data),
}
