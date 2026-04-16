import prisma from "@final/db";
import { CreateAssist, GetAssistFilters, AssistWithRelations } from "@final/shared";

export const assistModel = {
    create: async (data: CreateAssist): Promise<AssistWithRelations> => {
        return await prisma.assist.create({
            data: {
                worker_id: data.worker_id,
                attendance_id: data.attendance_id,
                start: data.start,
                close: data.close,
                alert: data.alert ?? false,
                alert_text: data.alert_text,
                is_deleted: data.is_deleted ?? false,
            },
            include: {
                worker: true,
                attendance: true,
            },
        });
    },

    get: async (filters: GetAssistFilters): Promise<AssistWithRelations | null> => {
        if (!filters.worker_id || !filters.attendance_id) return null;

        return await prisma.assist.findUnique({
            where: {
                worker_id_attendance_id: {
                    worker_id: filters.worker_id,
                    attendance_id: filters.attendance_id,
                },
            },
            include: {
                worker: true,
                attendance: true,
            },
        });
    },

    getMany: async (filters: GetAssistFilters): Promise<AssistWithRelations[]> => {
        return await prisma.assist.findMany({
            where: {
                ...(filters.worker_id && { worker_id: filters.worker_id }),
                ...(filters.attendance_id && { attendance_id: filters.attendance_id }),
                ...(filters.alert !== undefined && { alert: filters.alert }),
                ...(filters.is_deleted !== undefined && { is_deleted: filters.is_deleted }),
            },
            include: {
                worker: true,
                attendance: true,
            },
        });
    },
};
