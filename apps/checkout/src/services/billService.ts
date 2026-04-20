import apiClient from './apiClient'
import type {
  ApiResponse,
  BillFinance,
  BillWithRelations,
  CreateFullBill,
  GetManyBill,
} from '@final/shared'

const BILL_PATH = '/bills'

export async function listBills(filters?: GetManyBill) {
  const response = await apiClient.get<ApiResponse<BillWithRelations[]>>(BILL_PATH, {
    params: filters,
  })
  return response.data
}

export async function getTotal(bill_id: number) {
  const response = await apiClient.get<ApiResponse<BillFinance>>(`${BILL_PATH}/total`, {
    params: { bill_id },
  })
  return response.data
}

export async function createBill(payload: CreateFullBill) {
  const response = await apiClient.post<ApiResponse<BillWithRelations>>(BILL_PATH, payload)
  return response.data
}

export async function createFullBill(payload: CreateFullBill) {
  return createBill(payload)
}
