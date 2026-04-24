import type { AuditLogFilters } from "@final/shared";
import { auditModel } from "./audit.model.js";
export declare const auditService: {
    log: (data: Parameters<typeof auditModel.create>[0]) => Promise<import("@final/shared").AuditLog | null>;
    getMany: (filters: AuditLogFilters) => Promise<import("@final/shared").AuditLogPage>;
};
//# sourceMappingURL=audit.service.d.ts.map