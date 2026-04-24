/**
 * assist.service.ts — con resiliencia Redis
 * Circuit breaker en todas las operaciones.
 */

import { CreateAssist, GetAssistFilters } from '@final/shared'
import { assistModel } from './assist.model.js'
import { withCircuitBreaker } from '../../lib/circuitBreaker.js'

export const assistService = {
  create: async (data: CreateAssist) => {
    return await withCircuitBreaker(() => assistModel.create(data))
  },

  get: async (filters: GetAssistFilters) => {
    return await withCircuitBreaker(() => assistModel.get(filters))
  },

  getMany: async (filters: GetAssistFilters) => {
    return await withCircuitBreaker(() => assistModel.getMany(filters))
  },
}
