/**
 * tattoo.service.ts — con resiliencia Redis
 * Circuit breaker en todas las operaciones.
 * El catálogo de tatuajes se podría cachear, pero dado que incluye
 * imágenes firmadas de S3 con TTL propio, no cacheamos para evitar
 * URLs expiradas. Solo protegemos con circuit breaker.
 */

import type { Prisma } from '@final/db'
import { CreateTattooRequest, GetTattoo, GetTattooMaterials, CreateTattooMaterial } from '@final/shared'
import { tattooModel } from './tatto.model.js'
import prisma from '@final/db'
import { imgService } from '../img/img.service.js'
import { withCircuitBreaker } from '../../lib/circuitBreaker.js'

export const tattooService = {
  /*********
  |   READ  |
   *********/
  get: async (data: GetTattoo) => {
    return await withCircuitBreaker(() => tattooModel.get(data))
  },

  getMany: async () => {
    return await withCircuitBreaker(() => tattooModel.getMany())
  },

  getMaterials: async ({ tattoo_id }: GetTattooMaterials) => {
    return await withCircuitBreaker(() => tattooModel.getMaterials({ tattoo_id }))
  },

  /***********
  |   CREATE  |
   ***********/
  create: async (data: CreateTattooRequest) => {
    return await withCircuitBreaker(() =>
      prisma.$transaction(async (tx) => {
        const img = await imgService.create(
          { source: data.img.source, description: data.img.description },
          tx
        )
        const tattoo = await tattooModel.create(
          { img_id: img.img_id, cost: data.cost, time: data.time, name: data.name },
          tx
        )
        for (const m of data.materials) {
          await tattooService.createMaterial(
            { tattoo_id: tattoo.tattoo_id, quantity: m.quantity, product_variant_id: m.product_variant_id },
            tx
          )
        }
        return tattoo
      })
    )
  },

  createMaterial: async (data: CreateTattooMaterial, tx: Prisma.TransactionClient) => {
    return await tattooModel.createMaterial(data, tx)
  },
}
