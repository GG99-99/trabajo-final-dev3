import prisma from "@final/db";
export const noAssistModel = {
    create: async (data) => {
        return await prisma.noAssist.create({
            data: {
                attendance_id: data.attendance_id,
                worker_id: data.worker_id,
                create_at: data.create_at ?? new Date(),
                is_deleted: data.is_deleted ?? false,
            },
            include: {
                attendance: true,
                worker: true,
            },
        });
    },
    get: async (filters) => {
        if (!filters.no_assist_id)
            return null;
        return await prisma.noAssist.findUnique({
            where: { no_assist_id: filters.no_assist_id },
            include: {
                attendance: true,
                worker: true,
            },
        });
    },
    getMany: async (filters) => {
        return await prisma.noAssist.findMany({
            where: {
                ...(filters.no_assist_id && { no_assist_id: filters.no_assist_id }),
                ...(filters.attendance_id && { attendance_id: filters.attendance_id }),
                ...(filters.worker_id && { worker_id: filters.worker_id }),
                ...(filters.is_deleted !== undefined && { is_deleted: filters.is_deleted }),
            },
            include: {
                attendance: true,
                worker: true,
            },
        });
    },
};
//# sourceMappingURL=noAssist.model.js.map