/**
 * attendance.service.ts — con resiliencia Redis
 * Circuit breaker en todas las operaciones.
 */

import { CreateAttendance, GetAttendanceFilters } from '@final/shared'
import { attendanceModel } from './attendance.model.js'
import { withCircuitBreaker } from '../../lib/circuitBreaker.js'

export const attendanceService = {
  create: async (data: CreateAttendance) => {
    return await withCircuitBreaker(() => attendanceModel.create(data))
  },

  get: async (filters: GetAttendanceFilters) => {
    return await withCircuitBreaker(() => attendanceModel.get(filters))
  },

  getMany: async (filters: GetAttendanceFilters) => {
    return await withCircuitBreaker(() => attendanceModel.getMany(filters))
  },
}
