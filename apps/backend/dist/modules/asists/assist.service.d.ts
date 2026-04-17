import { CreateAssist, GetAssistFilters } from "@final/shared";
export declare const assistService: {
    create: (data: CreateAssist) => Promise<({
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
        close: Date | null;
        start: Date;
        is_deleted: boolean;
        attendance_id: number;
        alert: boolean;
        alert_text: string | null;
    }) | null>;
    get: (filters: GetAssistFilters) => Promise<({
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
        close: Date | null;
        start: Date;
        is_deleted: boolean;
        attendance_id: number;
        alert: boolean;
        alert_text: string | null;
    }) | null>;
    getMany: (filters: GetAssistFilters) => Promise<(({
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
        close: Date | null;
        start: Date;
        is_deleted: boolean;
        attendance_id: number;
        alert: boolean;
        alert_text: string | null;
    }) | null)[]>;
};
//# sourceMappingURL=assist.service.d.ts.map