/**
 * provider.service.ts — con resiliencia Redis
 * Cache larga (10 min) para lista y por ID.
 * Invalida cache en create.
 */

import { providerModel } from './provider.model.js'
import { GetProvider, CreateProvider } from '@final/shared'
import { withCircuitBreaker } from '../../lib/circuitBreaker.js'
import { withCache, invalidateCache, CK, TTL } from '../../lib/cache.js'

export const providerService = {
  /*********
  |   READ  |
   *********/
  get: async (filters: GetProvider) => {
    if (filters.provider_id) {
      const key = CK.PROVIDER(filters.provider_id)
      return await withCache(key, TTL.LONG, () =>
        withCircuitBreaker(() => providerModel.get(filters))
      )
    }
    return await withCircuitBreaker(() => providerModel.get(filters))
  },

  getMany: async () => {
    const key = CK.PROVIDERS()
    return await withCache(key, TTL.LONG, () =>
      withCircuitBreaker(() => providerModel.getMany())
    )
  },

  /***********
  |   CREATE  |
   ***********/
  create: async (data: CreateProvider) => {
    const result = await withCircuitBreaker(() => providerModel.create(data))
    await invalidateCache(CK.PROVIDERS())
    return result
  },
}