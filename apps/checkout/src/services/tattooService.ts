import apiClient from './apiClient'
import type { ApiResponse, TattoWithImg } from '@final/shared'

const TATTOO_PATH = '/tattoos'

export interface TattooPublic {
  tattoo_id: number
  name: string
  cost: number
  time: string
  img_id: number
}

export async function getAllTattoos(): Promise<ApiResponse<TattoWithImg[]>> {
  try {
    const response = await apiClient.get<ApiResponse<TattoWithImg[]>>(
      `${TATTOO_PATH}/`
    )
    return response.data
  } catch (error) {
    console.error('Error loading tattoos:', error)
    return { ok: false, data: null, error: { name: 'NetworkError', message: 'Error cargando tatuajes', statusCode: 503 } }
  }
}

export async function getTattooById(id: number) {
  const response = await apiClient.get<ApiResponse<TattoWithImg>>(
    `${TATTOO_PATH}/detail?tattoo_id=${id}`
  )
  return response.data
}
