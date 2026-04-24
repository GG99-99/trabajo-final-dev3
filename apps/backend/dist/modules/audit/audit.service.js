import { auditModel } from "./audit.model.js";
export const auditService = {
    log: (data) => auditModel.create(data).catch(() => null), // never throw — audit is non-critical
    getMany: (filters) => auditModel.getMany(filters),
};
//# sourceMappingURL=audit.service.js.map