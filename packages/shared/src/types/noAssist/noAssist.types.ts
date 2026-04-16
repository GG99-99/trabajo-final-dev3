import type { Prisma } from "@final/db";
import prisma from "@final/db";

export interface NoAssistCreateData {
    attendance_id: number;
    worker_id: number;
    create_at?: Date;
    is_deleted?: boolean;
}

export interface GetNoAssistFilters {
    no_assist_id?: number;
    attendance_id?: number;
    worker_id?: number;
    is_deleted?: boolean;
}

export type NoAssistWithRelations = Prisma.Result<
    typeof prisma.noAssist,
    {
        include: {
            attendance: true;
            worker: true;
        };
    },
    'findUnique'
>;