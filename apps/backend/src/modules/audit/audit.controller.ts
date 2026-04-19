import { Request, Response } from 'express'
import { auditService } from './audit.service.js'
import type { AuditLogFilters } from '@final/shared'

export const auditController = {
  getMany: async (req: Request, res: Response) => {
    const filters: AuditLogFilters = {
      page:      req.query.page      ? Number(req.query.page)      : 1,
      limit:     req.query.limit     ? Number(req.query.limit)     : 50,
      action:    req.query.action    as string | undefined,
      entity:    req.query.entity    as string | undefined,
      person_id: req.query.person_id ? Number(req.query.person_id) : undefined,
      date_from: req.query.date_from as string | undefined,
      date_to:   req.query.date_to   as string | undefined,
      sort:      (req.query.sort as 'asc' | 'desc') ?? 'desc',
    }
    const result = await auditService.getMany(filters)
    return res.json({ ok: true, data: result, error: null })
  },
}
