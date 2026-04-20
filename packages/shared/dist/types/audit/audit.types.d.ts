export type AuditAction = 'LOGIN' | 'REGISTER' | 'LOGOUT' | 'CREATE' | 'UPDATE' | 'DELETE' | 'BAN' | 'RESTORE' | 'PAYMENT' | 'REFUND' | 'TOKEN_REFRESH';
export interface AuditLog {
    audit_id: number;
    person_id: number | null;
    action: string;
    entity: string;
    entity_id: string | null;
    description: string | null;
    metadata: Record<string, unknown> | null;
    ip: string | null;
    created_at: string;
}
export interface AuditLogFilters {
    page?: number;
    limit?: number;
    action?: string;
    entity?: string;
    person_id?: number;
    date_from?: string;
    date_to?: string;
    sort?: 'asc' | 'desc';
}
export interface AuditLogPage {
    data: AuditLog[];
    total: number;
    page: number;
    pages: number;
}
//# sourceMappingURL=audit.types.d.ts.map