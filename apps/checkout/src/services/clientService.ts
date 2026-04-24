import apiClient from './apiClient'
import type { ApiResponse, ClientPublic } from '@final/shared'

const CLIENT_PATH = '/clients'

export async function searchClientByEmail(email: string): Promise<ApiResponse<ClientPublic | null>> {
  try {
    const response = await apiClient.get<ApiResponse<ClientPublic | null>>(`${CLIENT_PATH}/by-email`, {
      params: { email },
    })
    return response.data
  } catch (error) {
    console.error('Error searching client by email:', error)
    return { ok: false, data: null, error: { name: 'NetworkError', message: 'Error buscando cliente', statusCode: 503 } }
  }
}
