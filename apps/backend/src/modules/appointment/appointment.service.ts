/**
 * appointment.service.ts — con resiliencia Redis
 *
 * Cambios:
 *   - getBlocks cachea los bloques disponibles con TTL corto (60s).
 *     Si el core cae, devuelve el stale (dato expirado) en vez de error.
 *   - create invalida el cache de bloques del día/worker afectado.
 *   - withCircuitBreaker protege todas las llamadas a Prisma.
 */

import { AppointmentStatus, Prisma } from '@final/db'
import prisma from '@final/db'
import {
  ApiErr,
  AppointmentBlockTime,
  ScheduleJsonDay,
  GetAppointmentFilters,
  GetBlocks,
  CreateAppointment,
  AppointmentWithRelation,
} from '@final/shared'

import { appointmentModel } from './appointment.model.js'
import { diffTime } from '#backend/utils'
import { workerService } from '../worker/worker.service.js'
import { scheduleService } from '../schedule/schedule.service.js'
import { withCircuitBreaker } from '../../lib/circuitBreaker.js'
import { withCache, invalidateCache, CK, TTL } from '../../lib/cache.js'

export const appointmentService = {
  create: async (data: CreateAppointment) => {
    return await withCircuitBreaker(async () => {
      const blocks = await appointmentService.getBlocks({
        date: data.date,
        worker_id: data.worker_id,
      })

      let isOpen = false
      for (const block of blocks) {
        if (block.start <= data.start && data.end <= block.end) {
          isOpen = true
          break
        }
      }

      if (!isOpen) {
        throw { statusCode: 409, name: 'SlotUnavailable', message: 'The selected time slot is not available.' }
      }

      const result = await appointmentModel.create(data)

      // Invalida cache de bloques para este día/worker
      await invalidateCache(CK.APT_BLOCKS(data.date, data.worker_id))

      return result
    })
  },

  getMany: async (filters: GetAppointmentFilters): Promise<AppointmentWithRelation[]> => {
    return await withCircuitBreaker(() => appointmentModel.getMany(filters))
  },

  updateStatus: async (
    appointment_id: number,
    status: AppointmentStatus,
    tx: Prisma.TransactionClient
  ) => {
    return await appointmentModel.updateStatus(appointment_id, status, tx)
  },

  updateStatusDirect: async (appointment_id: number, status: AppointmentStatus) => {
    return await withCircuitBreaker(() =>
      prisma.$transaction(async (tx) => appointmentModel.updateStatus(appointment_id, status, tx))
    )
  },

  getBlocks: async ({ date, worker_id }: GetBlocks): Promise<AppointmentBlockTime[]> => {
    const cacheKey = CK.APT_BLOCKS(date, worker_id)

    return await withCache(cacheKey, TTL.SHORT, async () => {
      return await withCircuitBreaker(async () => {
        const errorObj: ApiErr = { statusCode: 400, message: 'BadRequest', name: 'RequestError' }

        type DayKey = 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday'
        const days: DayKey[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
        const localDate = new Date(date)
        const day = days[localDate.getDay()] as DayKey

        const worker = await workerService.get(worker_id)
        if (!worker) throw errorObj

        const schedule = await scheduleService.getActive(worker_id)
        if (!schedule) return []

        const daySchedule = schedule[day] as ScheduleJsonDay
        if (!daySchedule || !daySchedule.active) return []

        const blocks: AppointmentBlockTime[] = []
        const DAY_START = daySchedule.start
        const DAY_END = daySchedule.end

        const createBlock = (arr: AppointmentBlockTime[], start: string, end: string) =>
          arr.push({ start, end, duration: diffTime(start, end) })

        const appoints = await appointmentModel.getMany({ date, worker_id })
        if (appoints.length === 0) {
          createBlock(blocks, DAY_START, DAY_END)
          return appointmentService.applyRestrictions(blocks, daySchedule)
        }

        if (DAY_START < appoints[0]!.start) createBlock(blocks, DAY_START, appoints[0]!.start)

        for (let i = 0; i < appoints.length - 1; i++) {
          const endA = appoints[i]!.end
          if (endA > DAY_END) return blocks
          const startB = appoints[i + 1]!.start
          if (endA < startB) createBlock(blocks, endA, startB)
        }

        const lastEnd = appoints[appoints.length - 1]!.end
        if (lastEnd < DAY_END) createBlock(blocks, lastEnd, DAY_END)

        return appointmentService.applyRestrictions(blocks, daySchedule)
      })
    })
  },

  applyRestrictions: (blocks: AppointmentBlockTime[], daySchedule: ScheduleJsonDay) => {
    if (blocks.length === 0) return blocks
    const createBlock = (arr: AppointmentBlockTime[], start: string, end: string) =>
      arr.push({ start, end, duration: diffTime(start, end) })

    let updateBlocks = [...blocks]

    for (const restriction of daySchedule.breaks) {
      const current = [...updateBlocks]
      for (const block of current) {
        if (block.start < restriction.start && block.end > restriction.end) {
          updateBlocks = updateBlocks.filter(e => e !== block)
          createBlock(updateBlocks, block.start, restriction.start)
          createBlock(updateBlocks, restriction.end, block.end)
        } else if (block.start >= restriction.start && block.end <= restriction.end) {
          updateBlocks = updateBlocks.filter(e => e !== block)
        } else if (block.start < restriction.start && block.end > restriction.start) {
          updateBlocks = updateBlocks.filter(e => e !== block)
          createBlock(updateBlocks, block.start, restriction.start)
        } else if (block.start < restriction.end && block.end > restriction.end) {
          updateBlocks = updateBlocks.filter(e => e !== block)
          createBlock(updateBlocks, restriction.end, block.end)
        }
      }
    }

    return updateBlocks
  },
}
