import prisma from "@final/db";
export const auditModel = {
    /** Insert a new audit log entry */
    create: async (data) => {
        return await prisma.auditLog.create({ data });
    },
    /** Paginated query with filters */
    getMany: async (filters) => {
        const page = Math.max(1, filters.page ?? 1);
        const limit = Math.min(100, Math.max(1, filters.limit ?? 40));
        const skip = (page - 1) * limit;
        const where = {};
        if (filters.action)
            where.action = filters.action;
        if (filters.entity)
            where.entity = filters.entity;
        if (filters.person_id)
            where.person_id = filters.person_id;
        if (filters.date_from || filters.date_to) {
            where.created_at = {
                ...(filters.date_from && { gte: new Date(filters.date_from) }),
                ...(filters.date_to && { lte: new Date(filters.date_to + 'T23:59:59') }),
            };
        }
        const [data, total] = await Promise.all([
            prisma.auditLog.findMany({
                where,
                orderBy: { created_at: filters.sort === 'asc' ? 'asc' : 'desc' },
                skip,
                take: limit,
            }),
            prisma.auditLog.count({ where }),
        ]);
        return {
            data: data,
            total,
            page,
            pages: Math.ceil(total / limit),
        };
    },
};
//# sourceMappingURL=audit.model.js.map