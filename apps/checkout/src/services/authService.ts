import apiClient from './apiClient'
import type { ApiResponse, CashierJwtPayload, LoginData } from '@final/shared'

const AUTH = '/auth'

export async function loginCashier(body: LoginData) {
  const response = await apiClient.post<ApiResponse<CashierJwtPayload>>(`${AUTH}/cashier/login`, body)
  return response.data
}

export async function logoutCashier() {
  const response = await apiClient.post<ApiResponse<boolean>>(`${AUTH}/cashier/logout`)
  return response.data
}

export async function getCashierMe() {
  const response = await apiClient.get<ApiResponse<CashierJwtPayload>>(`${AUTH}/cashier/me`)
  return response.data
}
