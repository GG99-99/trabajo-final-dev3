import prisma from '@final/db'
import type { AuditLogFilters } from '@final/shared'

export const auditService = {
  log: async (data: {
    person_id?: number | null
    action: string
    entity: string
    entity_id?: string | null
    description?: string | null
    metadata?: Record<string, unknown> | null
    ip?: string | null
  }) => {
    return prisma.auditLog.create({ data })
  },

  getMany: async (filters: AuditLogFilters) => {
    const page  = filters.page  ?? 1
    const limit = filters.limit ?? 50
    const skip  = (page - 1) * limit

    const where = {
      ...(filters.action    && { action: filters.action }),
      ...(filters.entity    && { entity: filters.entity }),
      ...(filters.person_id && { person_id: filters.person_id }),
      ...((filters.date_from || filters.date_to) ? {
        created_at: {
          ...(filters.date_from && { gte: new Date(filters.date_from) }),
          ...(filters.date_to   && { lte: new Date(filters.date_to + 'T23:59:59') }),
        }
      } : {}),
    }

    const [data, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        orderBy: { created_at: filters.sort === 'asc' ? 'asc' : 'desc' },
        skip,
        take: limit,
      }),
      prisma.auditLog.count({ where }),
    ])

    return { data, total, page, pages: Math.ceil(total / limit) }
  },
}
