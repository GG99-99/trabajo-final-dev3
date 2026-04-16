import prisma from "@final/db";
import { toStartOfDay, toEndOfDay } from "#backend/utils";
export const attendanceModel = {
    create: async (data) => {
        return await prisma.attendance.create({
            data: {
                day: data.day,
                work_date: data.work_date,
                status: data.status ?? true,
                is_deleted: data.is_deleted ?? false,
            },
            include: {
                assists: true,
                noAssists: true,
            },
        });
    },
    get: async (filters) => {
        if (!filters.attendance_id)
            return null;
        return await prisma.attendance.findUnique({
            where: { attendance_id: filters.attendance_id },
            include: {
                assists: true,
                noAssists: true,
            },
        });
    },
    getMany: async (filters) => {
        return await prisma.attendance.findMany({
            where: {
                ...(filters.attendance_id && { attendance_id: filters.attendance_id }),
                ...(filters.day && { day: { contains: filters.day } }),
                ...(filters.status !== undefined && { status: filters.status }),
                ...(filters.is_deleted !== undefined && { is_deleted: filters.is_deleted }),
                ...(filters.work_date && {
                    work_date: {
                        gte: toStartOfDay(filters.work_date),
                        lte: toEndOfDay(filters.work_date),
                    },
                }),
            },
            include: {
                assists: true,
                noAssists: true,
            },
        });
    },
};
//# sourceMappingURL=attendance.model.js.map