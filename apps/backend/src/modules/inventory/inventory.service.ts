/**
 * inventory.service.ts — con resiliencia Redis
 * Cache media (5 min) para el inventario completo.
 * Las escrituras (create, updateQuantity) invalidan el cache.
 */

import prisma, { Prisma } from '@final/db'
import { inventoryModel } from './inventory.model.js'
import {
  GetInventoryFilters,
  GetQuantityInventoryFilters,
  UpdateQuantity,
  CreateInventoryItem,
  GetNotExpired,
} from '@final/shared'
import { stockMovementService } from '../stockMovement/stockMovement.service.js'
import { withCache, invalidateCache, CK, TTL } from '../../lib/cache.js'
import { withCircuitBreaker } from '../../lib/circuitBreaker.js'

export const inventoryService = {
  /*********
  |   READ  |
   *********/
  get: async (filters: GetInventoryFilters, tx?: Prisma.TransactionClient) => {
    // Con tx (dentro de transacción) no usamos cache
    if (tx) return await inventoryModel.get(filters, tx)
    return await withCircuitBreaker(() => inventoryModel.get(filters))
  },

  getTotalQuantity: async (filters: GetQuantityInventoryFilters) => {
    return await withCircuitBreaker(() => inventoryModel.getTotalQuantity(filters))
  },

  getNotExpired: async (filters: GetNotExpired, tx?: Prisma.TransactionClient) => {
    if (tx) return await inventoryModel.getNotExpired(filters, tx)
    return await withCircuitBreaker(() => inventoryModel.getNotExpired(filters))
  },

  getManyNotExpired: async (filters: GetNotExpired) => {
    const key = CK.INVENTORY()
    return await withCache(key, TTL.MEDIUM, () =>
      withCircuitBreaker(() => inventoryModel.getManyNotExpired(filters))
    )
  },

  /***********
  |   UPDATE  |
   ***********/
  updateQuantity: async (data: UpdateQuantity, tx: Prisma.TransactionClient) => {
    const result = await inventoryModel.updateQuantity(data, tx)
    await invalidateCache(CK.INVENTORY())
    return result
  },

  updateQuantityDirect: async (data: UpdateQuantity) => {
    const result = await withCircuitBreaker(() =>
      prisma.$transaction(async (tx) => inventoryModel.updateQuantity(data, tx))
    )
    await invalidateCache(CK.INVENTORY())
    return result
  },

  /***********
  |   CREATE  |
   ***********/
  create: async (data: CreateInventoryItem) => {
    const result = await withCircuitBreaker(() =>
      prisma.$transaction(async (tx) => {
        const inventoryItem = await inventoryModel.create(data, tx)
        await stockMovementService.create(
          {
            inventory_item_id: inventoryItem.inventory_item_id,
            quantity: data.current_quantity,
            reason: 'Entrada',
            type: 'entry',
          },
          tx
        )
        return inventoryItem
      })
    )
    await invalidateCache(CK.INVENTORY())
    return result
  },
}
