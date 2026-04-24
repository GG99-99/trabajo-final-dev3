import apiClient from './apiClient'
import type { ApiResponse, AppointmentWithRelation, GetAppointmentFilters } from '@final/shared'

const APPOINTMENT_PATH = '/appointments'

export async function getAppointments(filters?: GetAppointmentFilters): Promise<ApiResponse<AppointmentWithRelation[]>> {
  try {
    const response = await apiClient.get<ApiResponse<AppointmentWithRelation[]>>(APPOINTMENT_PATH, {
      params: filters,
    })
    return response.data
  } catch (error) {
    console.error('Error loading appointments:', error)
    return { ok: false, data: null, error: { name: 'NetworkError', message: 'Error cargando citas', statusCode: 503 } }
  }
}

export async function getAppointmentById(id: number) {
  const response = await apiClient.get<ApiResponse<AppointmentWithRelation>>(
    `${APPOINTMENT_PATH}/${id}`,
  )
  return response.data
}
