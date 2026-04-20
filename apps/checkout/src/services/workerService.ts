import apiClient from './apiClient'
import type { ApiResponse, WorkerPublic } from '@final/shared'

const WORKER_PATH = '/workers'

export async function getWorkers() {
  try {
    const response = await apiClient.get<ApiResponse<WorkerPublic[]>>(WORKER_PATH)
    console.log(response.data)
    return response.data
  } catch (error) {
    console.error('Error loading workers:', error)
    return { ok: false, data: [] }
  }
}

export async function getWorkerById(id: number) {
  const response = await apiClient.get<ApiResponse<WorkerPublic>>(`${WORKER_PATH}/${id}`)
  return response.data
}
