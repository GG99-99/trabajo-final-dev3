import type { AuditLogFilters, AuditLogPage } from '@final/shared'
import { api } from './api'

export const auditService = {
  getMany: (filters: AuditLogFilters = {}) =>
    api.get<AuditLogPage>('/audit', filters as Record<string, unknown>),
}
