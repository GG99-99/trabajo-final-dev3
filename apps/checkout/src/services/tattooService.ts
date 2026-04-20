import apiClient  from './apiClient'
import type { TattoWithImg } from '@final/shared'

const TATTOO_PATH = '/tattoos'

export interface TattooPublic {
  tattoo_id: number
  name: string
  cost: number
  time: string
  img_id: number
}

export async function getAllTattoos() {
  try {
    const response = await apiClient.get<{ ok: boolean; data: TattoWithImg[] }>(
      `${TATTOO_PATH}/`
    )
    return response.data
  } catch (error) {
    console.error('Error loading tattoos:', error)
    return { ok: false, data: [] }
  }
}

export async function getTattooById(id: number) {
  const response = await apiClient.get<{ ok: boolean; data: TattoWithImg }>(
    `${TATTOO_PATH}/detail?tattoo_id=${id}`
  )
  return response.data
}
