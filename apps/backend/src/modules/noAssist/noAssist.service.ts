/**
 * noAssist.service.ts — con resiliencia Redis
 * Circuit breaker en todas las operaciones.
 */

import { NoAssistCreateData, GetNoAssistFilters } from '@final/shared'
import { noAssistModel } from './noAssist.model.js'
import { withCircuitBreaker } from '../../lib/circuitBreaker.js'

export const noAssistService = {
  create: async (data: NoAssistCreateData) => {
    return await withCircuitBreaker(() => noAssistModel.create(data))
  },

  get: async (filters: GetNoAssistFilters) => {
    return await withCircuitBreaker(() => noAssistModel.get(filters))
  },

  getMany: async (filters: GetNoAssistFilters) => {
    return await withCircuitBreaker(() => noAssistModel.getMany(filters))
  },
}
