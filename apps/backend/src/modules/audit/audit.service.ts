import type { AuditLogFilters } from "@final/shared"
import { auditModel } from "./audit.model.js"

export const auditService = {
    log: (data: Parameters<typeof auditModel.create>[0]) =>
        auditModel.create(data).catch(() => null), // never throw — audit is non-critical

    getMany: (filters: AuditLogFilters) =>
        auditModel.getMany(filters),
}
