/**
 * category.service.ts — con resiliencia Redis
 * Cache larga (10 min) + stale fallback + invalidación en escrituras.
 */

import { categoryModel } from './category.model.js'
import { CreateCategory, GetManyCategory, GetCategory } from '@final/shared'
import { withCache, invalidateCache, invalidatePattern, CK, TTL } from '../../lib/cache.js'
import { withCircuitBreaker } from '../../lib/circuitBreaker.js'

export const categoryService = {
  get: async (filters: GetCategory) => {
    const key = CK.CATEGORY(filters.category_id ?? 0)
    return await withCache(key, TTL.LONG, () =>
      withCircuitBreaker(() => categoryModel.get(filters))
    )
  },

  getMany: async (filters: GetManyCategory) => {
    const key = CK.CATEGORIES()
    return await withCache(key, TTL.LONG, () =>
      withCircuitBreaker(() => categoryModel.getMany(filters))
    )
  },

  create: async (data: CreateCategory) => {
    const result = await withCircuitBreaker(() => categoryModel.create(data))
    await invalidateCache(CK.CATEGORIES())
    await invalidatePattern('category:*')
    return result
  },
}
