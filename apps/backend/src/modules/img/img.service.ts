/**
 * img.service.ts — con resiliencia Redis
 * Circuit breaker en lecturas.
 * Las escrituras ocurren siempre dentro de una transacción (tx),
 * por lo que el circuit breaker se aplica en el nivel superior (tattoo.service).
 */

import { Prisma } from '@final/db'
import { CreateImg, GetImg, GetManyImg, ImgWithRelations } from '@final/shared'
import { imgModel } from './img.model.js'
import { withCircuitBreaker } from '../../lib/circuitBreaker.js'

export const imgService = {
  /*********
  |   READ  |
   *********/
  get: async (filters: GetImg): Promise<ImgWithRelations | null> => {
    return await withCircuitBreaker(() => imgModel.get(filters))
  },

  getMany: async (filters: GetManyImg): Promise<ImgWithRelations[]> => {
    return await withCircuitBreaker(() => imgModel.getMany(filters))
  },

  /***********
  |   CREATE  |
   ***********/
  create: async (data: CreateImg, tx: Prisma.TransactionClient) => {
    // tx garantiza que estamos dentro de un withCircuitBreaker superior
    return await imgModel.create(data, tx)
  },
}