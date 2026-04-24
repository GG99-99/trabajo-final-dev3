import { CreateAttendance, GetAttendanceFilters } from "@final/shared";
export declare const attendanceService: {
    create: (data: CreateAttendance) => Promise<({
        assists: {
            is_deleted: boolean;
            worker_id: number;
            close: Date | null;
            start: Date;
            attendance_id: number;
            alert: boolean;
            alert_text: string | null;
        }[];
        noAssists: {
            is_deleted: boolean;
            worker_id: number;
            create_at: Date;
            attendance_id: number;
            no_assist_id: number;
        }[];
    } & {
        is_deleted: boolean;
        day: string;
        status: boolean;
        attendance_id: number;
        work_date: Date;
    }) | null>;
    get: (filters: GetAttendanceFilters) => Promise<({
        assists: {
            is_deleted: boolean;
            worker_id: number;
            close: Date | null;
            start: Date;
            attendance_id: number;
            alert: boolean;
            alert_text: string | null;
        }[];
        noAssists: {
            is_deleted: boolean;
            worker_id: number;
            create_at: Date;
            attendance_id: number;
            no_assist_id: number;
        }[];
    } & {
        is_deleted: boolean;
        day: string;
        status: boolean;
        attendance_id: number;
        work_date: Date;
    }) | null>;
    getMany: (filters: GetAttendanceFilters) => Promise<(({
        assists: {
            is_deleted: boolean;
            worker_id: number;
            close: Date | null;
            start: Date;
            attendance_id: number;
            alert: boolean;
            alert_text: string | null;
        }[];
        noAssists: {
            is_deleted: boolean;
            worker_id: number;
            create_at: Date;
            attendance_id: number;
            no_assist_id: number;
        }[];
    } & {
        is_deleted: boolean;
        day: string;
        status: boolean;
        attendance_id: number;
        work_date: Date;
    }) | null)[]>;
};
//# sourceMappingURL=attendance.service.d.ts.map