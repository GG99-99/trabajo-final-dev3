import { api } from './api'

export type Tattoo = {
  tattoo_id: number
  img_id: number
  cost: number
  time: string
  name: string
  img?: { s3_url?: string | null; s3_key?: string | null }
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

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3030/api'

export const tattooService = {
  /** GET /api/tattoos */
  getMany: () => api.get<Tattoo[]>('/tattoos'),

  /** GET /api/tattoos/detail?tattoo_id= */
  getOne: (tattoo_id: number) =>
    api.get<Tattoo>('/tattoos/detail', { tattoo_id }),

  /** GET /api/tattoos/materials?tattoo_id= */
  getMaterials: (tattoo_id: number) =>
    api.get<TattooMaterial[]>('/tattoos/materials', { tattoo_id }),

  /** POST /api/tattoos/with-image — multipart form */
  createWithImage: async (data: {
    name: string; cost: number; time: string
    description?: string; imageFile: File
  }) => {
    const form = new FormData()
    form.append('image', data.imageFile)
    form.append('name', data.name)
    form.append('cost', String(data.cost))
    form.append('time', data.time)
    if (data.description) form.append('description', data.description)
    const res = await fetch(`${BASE_URL}/tattoos/with-image`, {
      method: 'POST',
      credentials: 'include',
      body: form,
    })
    return res.json() as Promise<{ ok: boolean; data: Tattoo; error: any }>
  },

  /** PATCH /api/tattoos/:tattoo_id — update fields, optionally replace image */
  update: async (tattoo_id: number, data: {
    name?: string; cost?: number; time?: string
    description?: string; imageFile?: File
  }) => {
    const form = new FormData()
    if (data.imageFile)   form.append('image', data.imageFile)
    if (data.name)        form.append('name', data.name)
    if (data.cost != null) form.append('cost', String(data.cost))
    if (data.time)        form.append('time', data.time)
    if (data.description !== undefined) form.append('description', data.description)
    const res = await fetch(`${BASE_URL}/tattoos/${tattoo_id}`, {
      method: 'PATCH',
      credentials: 'include',
      body: form,
    })
    return res.json() as Promise<{ ok: boolean; data: Tattoo; error: any }>
  },

  /** Image URL helper — uses S3 URL if available, falls back to raw endpoint */
  imageUrl: (tattoo: Tattoo) =>
    tattoo.img?.s3_url ?? `${BASE_URL}/imgs/raw/${tattoo.img_id}`,
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
