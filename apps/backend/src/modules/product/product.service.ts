/**
 * product.service.ts — con resiliencia Redis
 *
 * Catálogo de productos cacheado con TTL largo (10 min).
 * Si el core cae, se sirve el stale del catálogo sin error.
 * Las escrituras (create) invalidan el cache del catálogo.
 */

import { productModel } from './product.model.js'
import { CreateProduct, GetManyProduct, GetProduct } from '@final/shared'
import { withCache, invalidateCache, invalidatePattern, CK, TTL } from '../../lib/cache.js'
import { withCircuitBreaker } from '../../lib/circuitBreaker.js'

export const productService = {
  get: async (filters: GetProduct) => {
    const key = CK.PRODUCT(filters.product_id ?? 0)
    return await withCache(key, TTL.LONG, () =>
      withCircuitBreaker(() => productModel.get(filters))
    )
  },

  getMany: async (filters: GetManyProduct) => {
    const key = CK.PRODUCTS(JSON.stringify(filters))
    return await withCache(key, TTL.LONG, () =>
      withCircuitBreaker(() => productModel.getMany(filters))
    )
  },

  create: async (data: CreateProduct) => {
    const result = await withCircuitBreaker(() => productModel.create(data))
    // Invalida todo el catálogo
    await invalidatePattern('products:*')
    await invalidateCache(CK.CATEGORIES())
    return result
  },
}
