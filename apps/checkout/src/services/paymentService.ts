import apiClient from './apiClient'
import type {
  ApiResponse,
  CreatePayment,
  PaymentWithRelations,
  GetManyPayment,
} from '@final/shared'

const PAYMENT_PATH = '/payments'

export async function listPayments(filters?: GetManyPayment) {
  const response = await apiClient.get<ApiResponse<PaymentWithRelations[]>>(PAYMENT_PATH, {
    params: filters,
  })
  return response.data
}

export async function createPayment(payload: CreatePayment) {
  const response = await apiClient.post<ApiResponse<PaymentWithRelations>>(PAYMENT_PATH, payload)
  return response.data
}
