/**
 * seat.service.ts — con resiliencia Redis
 * Cache de asientos (5 min). Los asientos cambian poco, sirve stale si el core cae.
 */

import { CreateSeat, GetSeatFilters } from '@final/shared'
import { seatModel } from './seat.model.js'
import { withCache, invalidateCache, CK, TTL } from '../../lib/cache.js'
import { withCircuitBreaker } from '../../lib/circuitBreaker.js'

export const seatService = {
  get: async (filters: GetSeatFilters) => {
    return await withCircuitBreaker(() => seatModel.get(filters))
  },

  getMany: async (filters: GetSeatFilters) => {
    const key = CK.SEATS()
    return await withCache(key, TTL.MEDIUM, () =>
      withCircuitBreaker(() => seatModel.getMany(filters))
    )
  },

  create: async (data: CreateSeat) => {
    const result = await withCircuitBreaker(() => seatModel.create(data))
    await invalidateCache(CK.SEATS())
    return result
  },
}
