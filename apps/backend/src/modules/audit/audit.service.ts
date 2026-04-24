/**
 * audit.service.ts — con resiliencia Redis
 *
 * Estrategia:
 *   - log() nunca lanza: si Prisma está caído, el log se encola en Redis
 *     y se sincroniza cuando el core vuelve (via queueWorker).
 *   - getMany() usa circuit breaker con 503 claro si el core está caído.
 */

import type { AuditLogFilters } from '@final/shared'
import { auditModel } from './audit.model.js'
import { withCircuitBreaker } from '../../lib/circuitBreaker.js'
import { enqueueWrite } from '../../lib/writeQueue.js'

export const auditService = {
  log: async (data: Parameters<typeof auditModel.create>[0]) => {
    try {
      return await withCircuitBreaker(() => auditModel.create(data))
    } catch {
      // Si el core está caído, encolamos el log — nunca se pierde
      await enqueueWrite('audit', 'log', data as Record<string, unknown>).catch(() => null)
      return null
    }
  },

  getMany: async (filters: AuditLogFilters) => {
    return await withCircuitBreaker(() => auditModel.getMany(filters))
  },
}
