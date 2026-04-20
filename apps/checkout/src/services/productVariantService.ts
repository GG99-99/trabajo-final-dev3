import apiClient  from './apiClient'
import type { ProductVariantWithRelations } from '@final/shared'

const PRODUCT_VARIANT_PATH = '/product-variants'

export async function getAllProductVariants() {
  try {
    const response = await apiClient.get<{ ok: boolean; data: ProductVariantWithRelations[] }>(
      `${PRODUCT_VARIANT_PATH}/`
    )
    return response.data
  } catch (error) {
    console.error('Error loading product variants:', error)
    return { ok: false, data: [] }
  }
}

export async function getProductVariantById(id: number) {
  const response = await apiClient.get<{ ok: boolean; data: ProductVariantWithRelations }>(
    `${PRODUCT_VARIANT_PATH}/detail?product_variant_id=${id}`
  )
  return response.data
}
