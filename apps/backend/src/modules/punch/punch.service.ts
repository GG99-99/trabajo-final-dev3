/**
 * punch.service.ts — con resiliencia Redis
 *
 * Cambios respecto a la versión original:
 *   - clockIn / clockOut usan withCircuitBreaker para detectar caídas del core.
 *   - Si el circuito está OPEN (core caído), se encola la operación en Redis
 *     y se responde al cliente con confirmación de "registrado offline".
 *   - getTodayStatus usa cache de corta duración para reducir presión en DB.
 *   - Un worker en app.ts drena la cola cuando el core se recupera.
 */

import prisma from '@final/db'
import { ApiErr } from '@final/shared'
import { withCircuitBreaker } from '../../lib/circuitBreaker.js'
import { enqueueWrite } from '../../lib/writeQueue.js'
import { safeRedis } from '../../lib/redis.js'

const todayStr = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const STATUS_CACHE_KEY = (worker_id: number) => `punch:status:${worker_id}:${todayStr()}`
const STATUS_TTL = 30  // 30 s

export const punchService = {
  getOrCreateAttendance: async () => {
    const today = todayStr()
    const existing = await prisma.attendance.findFirst({
      where: { day: today, is_deleted: false },
    })
    if (existing) return existing
    return await prisma.attendance.create({
      data: { day: today, work_date: new Date(), status: true },
    })
  },

  clockIn: async (worker_id: number) => {
    try {
      return await withCircuitBreaker(async () => {
        const worker = await prisma.worker.findUnique({ where: { worker_id } })
        if (!worker)
          throw { statusCode: 404, name: 'WorkerNotFound', message: 'Trabajador no encontrado.' } as ApiErr

        const attendance = await punchService.getOrCreateAttendance()

        const existing = await prisma.assist.findUnique({
          where: { worker_id_attendance_id: { worker_id, attendance_id: attendance.attendance_id } },
        })
        if (existing)
          throw { statusCode: 409, name: 'AlreadyClockedIn', message: 'Ya registraste tu entrada hoy.' } as ApiErr

        const result = await prisma.assist.create({
          data: { worker_id, attendance_id: attendance.attendance_id, start: new Date(), alert: false },
          include: { worker: { include: { person: true } }, attendance: true },
        })

        // Invalida cache de status
        await safeRedis(r => r.del(STATUS_CACHE_KEY(worker_id)), undefined)
        return result
      })
    } catch (err: any) {
      // Si el circuit está OPEN (503), encolamos para sync posterior
      if (err?.statusCode === 503) {
        const queued = await enqueueWrite('punch', 'clockIn', { worker_id })
        return {
          offline: true,
          queued: !!queued,
          message: 'Entrada registrada localmente. Se sincronizará cuando el servidor esté disponible.',
          worker_id,
          recorded_at: new Date().toISOString(),
        }
      }
      throw err
    }
  },

  clockOut: async (worker_id: number) => {
    try {
      return await withCircuitBreaker(async () => {
        const worker = await prisma.worker.findUnique({ where: { worker_id } })
        if (!worker)
          throw { statusCode: 404, name: 'WorkerNotFound', message: 'Trabajador no encontrado.' } as ApiErr

        const attendance = await punchService.getOrCreateAttendance()

        const assist = await prisma.assist.findUnique({
          where: { worker_id_attendance_id: { worker_id, attendance_id: attendance.attendance_id } },
        })
        if (!assist)
          throw { statusCode: 409, name: 'NotClockedIn', message: 'No has registrado tu entrada hoy.' } as ApiErr
        if (assist.close)
          throw { statusCode: 409, name: 'AlreadyClockedOut', message: 'Ya registraste tu salida hoy.' } as ApiErr

        const result = await prisma.assist.update({
          where: { worker_id_attendance_id: { worker_id, attendance_id: attendance.attendance_id } },
          data: { close: new Date() },
          include: { worker: { include: { person: true } }, attendance: true },
        })

        await safeRedis(r => r.del(STATUS_CACHE_KEY(worker_id)), undefined)
        return result
      })
    } catch (err: any) {
      if (err?.statusCode === 503) {
        const queued = await enqueueWrite('punch', 'clockOut', { worker_id })
        return {
          offline: true,
          queued: !!queued,
          message: 'Salida registrada localmente. Se sincronizará cuando el servidor esté disponible.',
          worker_id,
          recorded_at: new Date().toISOString(),
        }
      }
      throw err
    }
  },

  getTodayStatus: async (worker_id: number) => {
    const cacheKey = STATUS_CACHE_KEY(worker_id)

    // Intenta cache
    const cached = await safeRedis(r => r.get(cacheKey), null)
    if (cached) {
      try { return JSON.parse(cached) } catch { /* corrupto */ }
    }

    const result = await withCircuitBreaker(async () => {
      const attendance = await prisma.attendance.findFirst({
        where: { day: todayStr(), is_deleted: false },
      })
      if (!attendance) return { clocked_in: false, clocked_out: false, assist: null }

      const assist = await prisma.assist.findUnique({
        where: { worker_id_attendance_id: { worker_id, attendance_id: attendance.attendance_id } },
        include: { worker: { include: { person: true } }, attendance: true },
      })

      return { clocked_in: !!assist, clocked_out: !!assist?.close, assist }
    }).catch(() => {
      // Fallback: estado desconocido si el core está caído
      return { clocked_in: null, clocked_out: null, assist: null, offline: true }
    })

    await safeRedis(r => r.setex(cacheKey, STATUS_TTL, JSON.stringify(result)), undefined)
    return result
  },

  getHistory: async (filters: { worker_id?: number; date?: string }) => {
    return await withCircuitBreaker(() =>
      prisma.assist.findMany({
        where: {
          ...(filters.worker_id && { worker_id: filters.worker_id }),
          ...(filters.date && { attendance: { day: filters.date } }),
          is_deleted: false,
        },
        include: { worker: { include: { person: true } }, attendance: true },
        orderBy: { start: 'desc' },
      })
    )
  },
}
