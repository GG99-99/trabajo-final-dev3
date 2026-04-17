import { NoAssistCreateData, GetNoAssistFilters } from "@final/shared";
export declare const noAssistService: {
    create: (data: NoAssistCreateData) => Promise<({
        worker: {
            person_id: number;
            specialty: import("@prisma/client").$Enums.WorkerSpecialty;
            worker_id: number;
        };
        attendance: {
            day: string;
            is_deleted: boolean;
            status: boolean;
            attendance_id: number;
            work_date: Date;
        };
    } & {
        worker_id: number;
        create_at: Date;
        is_deleted: boolean;
        attendance_id: number;
        no_assist_id: number;
    }) | null>;
    get: (filters: GetNoAssistFilters) => Promise<({
        worker: {
            person_id: number;
            specialty: import("@prisma/client").$Enums.WorkerSpecialty;
            worker_id: number;
        };
        attendance: {
            day: string;
            is_deleted: boolean;
            status: boolean;
            attendance_id: number;
            work_date: Date;
        };
    } & {
        worker_id: number;
        create_at: Date;
        is_deleted: boolean;
        attendance_id: number;
        no_assist_id: number;
    }) | null>;
    getMany: (filters: GetNoAssistFilters) => Promise<(({
        worker: {
            person_id: number;
            specialty: import("@prisma/client").$Enums.WorkerSpecialty;
            worker_id: number;
        };
        attendance: {
            day: string;
            is_deleted: boolean;
            status: boolean;
            attendance_id: number;
            work_date: Date;
        };
    } & {
        worker_id: number;
        create_at: Date;
        is_deleted: boolean;
        attendance_id: number;
        no_assist_id: number;
    }) | null)[]>;
};
//# sourceMappingURL=noAssist.service.d.ts.map