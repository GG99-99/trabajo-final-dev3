import apiClient from './apiClient'
import type { ApiResponse, ProductVariantWithRelations } from '@final/shared'

const PRODUCT_VARIANT_PATH = '/product-variants'

export async function getAllProductVariants(): Promise<ApiResponse<ProductVariantWithRelations[]>> {
  try {
    const response = await apiClient.get<ApiResponse<ProductVariantWithRelations[]>>(
      `${PRODUCT_VARIANT_PATH}/`
    )
    return response.data
  } catch (error) {
    console.error('Error loading product variants:', error)
    return { ok: false, data: null, error: { name: 'NetworkError', message: 'Error cargando variantes', statusCode: 503 } }
  }
}

export async function getProductVariantById(id: number) {
  const response = await apiClient.get<ApiResponse<ProductVariantWithRelations>>(
    `${PRODUCT_VARIANT_PATH}/detail?product_variant_id=${id}`
  )
  return response.data
}
