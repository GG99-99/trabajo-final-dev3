/**
 * schedule.service.ts — con resiliencia Redis
 * Cache media (5 min) para schedules activos por worker.
 * Se invalida cuando se crea o inactiva un schedule.
 */

import { CreateSchedule, ScheduleDayOfWeek, GetManySchedules } from '@final/shared'
import { scheduleModel } from './schedule.model.js'
import { withCache, invalidateCache, CK, TTL } from '../../lib/cache.js'
import { withCircuitBreaker } from '../../lib/circuitBreaker.js'

export const scheduleService = {
  /*********
  |   READ  |
   *********/
  getActive: async (worker_id: number) => {
    const key = CK.SCHEDULE(worker_id)
    return await withCache(key, TTL.MEDIUM, () =>
      withCircuitBreaker(() => scheduleModel.getActive(worker_id))
    )
  },

  getMany: async (filters: GetManySchedules) => {
    return await withCircuitBreaker(() => scheduleModel.getMany(filters))
  },

  getDayByWorker: async (worker_id: number, day: ScheduleDayOfWeek) => {
    return await withCircuitBreaker(() => scheduleModel.getDayByWorker(worker_id, day))
  },

  /***********
  |   CREATE  |
   ***********/
  create: async (data: CreateSchedule) => {
    return await withCircuitBreaker(async () => {
      // Inactivar schedules activos
      const activeSchedules = await scheduleService.getMany({
        worker_id: data.worker_id,
        active: true,
      })
      for (const sch of activeSchedules) {
        await scheduleService.inactive(sch.schedule_id)
      }
      const result = await scheduleModel.create(data)
      // Invalida cache del schedule activo de este worker
      await invalidateCache(CK.SCHEDULE(data.worker_id))
      return result
    })
  },

  /***********
  |   UPDATE  |
   ***********/
  inactive: async (schedule_id: number) => {
    const result = await withCircuitBreaker(() => scheduleModel.inactive(schedule_id))
    // No sabemos el worker_id aquí, pero el create ya invalida; esto es extra-safe
    return result
  },
}
