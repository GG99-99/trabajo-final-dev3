import apiClient from './apiClient'
import type { ApiResponse, WorkerPublic } from '@final/shared'

const WORKER_PATH = '/workers'

export async function getWorkers(): Promise<ApiResponse<WorkerPublic[]>> {
  try {
    const response = await apiClient.get<ApiResponse<WorkerPublic[]>>(WORKER_PATH)
    return response.data
  } catch (error) {
    console.error('Error loading workers:', error)
    return { ok: false, data: null, error: { name: 'NetworkError', message: 'Error cargando trabajadores', statusCode: 503 } }
  }
}

export async function getWorkerById(id: number) {
  const response = await apiClient.get<ApiResponse<WorkerPublic>>(`${WORKER_PATH}/${id}`)
  return response.data
}
