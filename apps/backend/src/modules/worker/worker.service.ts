/**
 * worker.service.ts — con resiliencia Redis
 * Cache media (5 min) para la lista de workers y por ID.
 * Si el core cae, se sirve stale para lecturas.
 */

import { workerModel } from './worker.model.js'
import { workerUtils } from './worker.utils.js'
import { ApiErr, WorkerWithPerson, WorkerPublic } from '@final/shared'
import { log } from '#looger'
import { withCache, invalidateCache, CK, TTL } from '../../lib/cache.js'
import { withCircuitBreaker } from '../../lib/circuitBreaker.js'

export const workerService = {
  get: async (worker_id: number): Promise<WorkerWithPerson> => {
    const key = CK.WORKER(worker_id)
    return await withCache(key, TTL.MEDIUM, async () => {
      return await withCircuitBreaker(async () => {
        const w: WorkerWithPerson = await workerModel.get(worker_id)
        if (!w) {
          log.error('Se busco un worker que no existe')
          throw { statusCode: 400, name: 'NotWorkerFound', message: 'no se encontro el trabajador' } as ApiErr
        }
        return w
      })
    })
  },

  getMany: async (): Promise<WorkerPublic[]> => {
    const key = CK.WORKERS()
    return await withCache(key, TTL.MEDIUM, async () => {
      return await withCircuitBreaker(async () => {
        const ws: WorkerWithPerson[] = await workerModel.getMany()
        if (ws.length === 0) return []
        return ws.map(w => workerUtils.workerToPublic(w))
      })
    })
  },
}
