import type { AuditLogFilters, AuditLog, AuditLogPage } from "@final/shared";
export declare const auditModel: {
    /** Insert a new audit log entry */
    create: (data: {
        person_id?: number | null;
        action: string;
        entity: string;
        entity_id?: string | null;
        description?: string | null;
        metadata?: Record<string, unknown> | null;
        ip?: string | null;
    }) => Promise<AuditLog>;
    /** Paginated query with filters */
    getMany: (filters: AuditLogFilters) => Promise<AuditLogPage>;
};
//# sourceMappingURL=audit.model.d.ts.map