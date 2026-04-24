/**
 * cashier.service.ts — con resiliencia Redis
 * Cache del estado del cajero (5 min) + circuit breaker.
 */

import { CashierPublic, CashierWithPerson, CreatePerson } from '@final/shared'
import { cashierModel } from './cashier.model.js'
import { personService } from '../person/person.service.js'
import { cashierUtils } from './cashier.utils.js'
import { withCircuitBreaker } from '../../lib/circuitBreaker.js'
import { withCache, invalidateCache, CK, TTL } from '../../lib/cache.js'

export const cashierService = {
  get: async (cashier_id: number) => {
    const key = CK.CASHIER_STATUS(cashier_id)
    return await withCache(key, TTL.MEDIUM, () =>
      withCircuitBreaker(() => cashierModel.get(cashier_id))
    )
  },

  getMany: async () => {
    return await withCircuitBreaker(async () => {
      const cashiers: CashierWithPerson[] = await cashierModel.getMany()
      if (cashiers.length === 0) return []
      const publicCashiers: CashierPublic[] = []
      for (const c of cashiers) publicCashiers.push(cashierUtils.cashierToPublic(c))
      return publicCashiers
    })
  },

  create: async (data: CreatePerson) => {
    const result = await withCircuitBreaker(() => personService.create(data))
    // No hay CK genérico para cashiers list, pero invalidamos por id si se conoce
    return result
  },
}
