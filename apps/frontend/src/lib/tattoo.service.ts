import { api } from './api'

export type Tattoo = {
  tattoo_id: number
  img_id: number
  cost: number
  time: string
  name: string
}

export type TattooMaterial = {
  product_variant_id: number
  tattoo_id: number
  quantity: number
}

export type Img = {
  img_id: number
  source: unknown
  description: string | null
  create_at: string
  active: boolean
  tattoos: Tattoo[]
}

export type CreateTattooRequest = {
  name: string
  cost: number
  time: string
  img: { source: unknown; description?: string }
  materials: { product_variant_id: number; quantity: number }[]
}

export const tattooService = {
  /** GET /api/tattoos/detail?tattoo_id= */
  getOne: (tattoo_id: number) =>
    api.get<Tattoo>('/tattoos/detail', { tattoo_id }),

  /** GET /api/tattoos/materials?tattoo_id= */
  getMaterials: (tattoo_id: number) =>
    api.get<TattooMaterial[]>('/tattoos/materials', { tattoo_id }),

  /** POST /api/tattoos */
  create: (data: CreateTattooRequest) =>
    api.post<Tattoo>('/tattoos', data),
}

export const imgService = {
  /** GET /api/imgs */
  getMany: (filters?: { date?: string; active?: boolean }) =>
    api.get<Img[]>('/imgs', filters as Record<string, unknown>),

  /** GET /api/imgs/detail */
  getOne: (filters: { img_id: number; description?: string }) =>
    api.get<Img>('/imgs/detail', filters as Record<string, unknown>),

  /** POST /api/imgs */
  create: (data: { source: unknown; description?: string }) =>
    api.post<Img>('/imgs', data),
}
