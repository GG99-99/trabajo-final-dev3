import { Request, Response } from "express"
import { auditService } from "./audit.service.js"
import type { AuditLogFilters } from "@final/shared"

export const auditController = {
    getMany: async (req: Request, res: Response) => {
        const filters: AuditLogFilters = {
            page:      req.query.page      ? Number(req.query.page)      : 1,
            limit:     req.query.limit     ? Number(req.query.limit)     : 40,
            action:    req.query.action    ? String(req.query.action)    : undefined,
            entity:    req.query.entity    ? String(req.query.entity)    : undefined,
            person_id: req.query.person_id ? Number(req.query.person_id) : undefined,
            date_from: req.query.date_from ? String(req.query.date_from) : undefined,
            date_to:   req.query.date_to   ? String(req.query.date_to)   : undefined,
            sort:      req.query.sort === 'asc' ? 'asc' : 'desc',
        }
        const result = await auditService.getMany(filters)
        return res.json({ ok: true, data: result, error: null })
    },
}
