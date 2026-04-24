/**
 * productVariant.service.ts — con resiliencia Redis
 * Cache media (5 min) por ID y por filtros.
 * Invalida cache en create.
 */

import { productVariantModel } from './productVariant.model.js'
import { CreateProductVariant, GetManyProductVariant, GetProductVariant } from '@final/shared'
import { withCircuitBreaker } from '../../lib/circuitBreaker.js'
import { withCache, invalidateCache, CK, TTL } from '../../lib/cache.js'

export const productVariantService = {
  get: async (filters: GetProductVariant) => {
    if (filters.product_variant_id) {
      const key = CK.PVARIANT(filters.product_variant_id)
      return await withCache(key, TTL.MEDIUM, () =>
        withCircuitBreaker(() => productVariantModel.get(filters))
      )
    }
    return await withCircuitBreaker(() => productVariantModel.get(filters))
  },

  getMany: async (filters: GetManyProductVariant) => {
    const key = CK.PVARIANTS(JSON.stringify(filters))
    return await withCache(key, TTL.MEDIUM, () =>
      withCircuitBreaker(() => productVariantModel.getMany(filters))
    )
  },

  create: async (data: CreateProductVariant) => {
    const result = await withCircuitBreaker(() => productVariantModel.create(data))
    // Invalida listas de variantes del producto afectado
    if (data.product_id) {
      await invalidateCache(CK.PVARIANTS(JSON.stringify({ product_id: data.product_id })))
    }
    return result
  },
}
