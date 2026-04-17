import { CreateAttendance, GetAttendanceFilters } from "@final/shared";
export declare const attendanceService: {
    create: (data: CreateAttendance) => Promise<({
        assists: {
            worker_id: number;
            close: Date | null;
            start: Date;
            is_deleted: boolean;
            attendance_id: number;
            alert: boolean;
            alert_text: string | null;
        }[];
        noAssists: {
            worker_id: number;
            create_at: Date;
            is_deleted: boolean;
            attendance_id: number;
            no_assist_id: number;
        }[];
    } & {
        day: string;
        is_deleted: boolean;
        status: boolean;
        attendance_id: number;
        work_date: Date;
    }) | null>;
    get: (filters: GetAttendanceFilters) => Promise<({
        assists: {
            worker_id: number;
            close: Date | null;
            start: Date;
            is_deleted: boolean;
            attendance_id: number;
            alert: boolean;
            alert_text: string | null;
        }[];
        noAssists: {
            worker_id: number;
            create_at: Date;
            is_deleted: boolean;
            attendance_id: number;
            no_assist_id: number;
        }[];
    } & {
        day: string;
        is_deleted: boolean;
        status: boolean;
        attendance_id: number;
        work_date: Date;
    }) | null>;
    getMany: (filters: GetAttendanceFilters) => Promise<(({
        assists: {
            worker_id: number;
            close: Date | null;
            start: Date;
            is_deleted: boolean;
            attendance_id: number;
            alert: boolean;
            alert_text: string | null;
        }[];
        noAssists: {
            worker_id: number;
            create_at: Date;
            is_deleted: boolean;
            attendance_id: number;
            no_assist_id: number;
        }[];
    } & {
        day: string;
        is_deleted: boolean;
        status: boolean;
        attendance_id: number;
        work_date: Date;
    }) | null)[]>;
};
//# sourceMappingURL=attendance.service.d.ts.map