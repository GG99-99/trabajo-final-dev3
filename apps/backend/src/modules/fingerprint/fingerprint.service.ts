/**
 * fingerprint.service.ts — con resiliencia Redis
 * Circuit breaker en todas las operaciones.
 * No se cachean templates (datos biométricos sensibles y siempre frescos).
 */

import prisma from '@final/db'
import { ApiErr } from '@final/shared'
import { withCircuitBreaker } from '../../lib/circuitBreaker.js'

export const fingerprintService = {
  getByWorker: async (worker_id: number) => {
    return await withCircuitBreaker(() =>
      prisma.fingerprint.findUnique({ where: { worker_id } })
    )
  },

  upsert: async (worker_id: number, template: string, finger_index: number) => {
    return await withCircuitBreaker(() =>
      prisma.fingerprint.upsert({
        where: { worker_id },
        update: { template, finger_index, updated_at: new Date() },
        create: { worker_id, template, finger_index },
      })
    )
  },

  delete: async (worker_id: number) => {
    return await withCircuitBreaker(async () => {
      const existing = await prisma.fingerprint.findUnique({ where: { worker_id } })
      if (!existing)
        throw { statusCode: 404, name: 'NotFound', message: 'No fingerprint registered.' } as ApiErr
      return await prisma.fingerprint.delete({ where: { worker_id } })
    })
  },

  getAll: async () => {
    return await withCircuitBreaker(() =>
      prisma.fingerprint.findMany({
        include: { worker: { include: { person: true } } },
      })
    )
  },

  getWorkersWithoutFingerprint: async () => {
    return await withCircuitBreaker(() =>
      prisma.worker.findMany({
        where: { fingerprint: null },
        include: { person: true },
      })
    )
  },
}
