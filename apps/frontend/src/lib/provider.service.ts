import { api } from './api'

export type Provider = {
  provider_id: number
  name: string
  code: string
  phone_number: string
  address: string
  products: unknown[]
}

export const providerService = {
  /** GET /api/providers */
  getAll: () => api.get<Provider[]>('/providers'),

  /** GET /api/providers/detail?provider_id= */
  getOne: (provider_id: number) =>
    api.get<Provider>('/providers/detail', { provider_id }),

  /** POST /api/providers */
  create: (data: {
    name: string
    code: string
    phone_number: string
    address: string
  }) => api.post<Provider>('/providers', data),
}
