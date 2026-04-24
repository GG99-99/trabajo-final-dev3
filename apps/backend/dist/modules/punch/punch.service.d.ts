export declare const punchService: {
    getOrCreateAttendance: () => Promise<{
        is_deleted: boolean;
        day: string;
        status: boolean;
        attendance_id: number;
        work_date: Date;
    }>;
    clockIn: (worker_id: number) => Promise<{
        worker: {
            person: {
                person_id: number;
                first_name: string;
                last_name: string;
                email: string;
                password: string | null;
                type: import("@final/db").$Enums.PersonType;
                tag: string | null;
                is_deleted: boolean;
            };
        } & {
            person_id: number;
            specialty: import("@final/db").$Enums.WorkerSpecialty;
            worker_id: number;
        };
        attendance: {
            is_deleted: boolean;
            day: string;
            status: boolean;
            attendance_id: number;
            work_date: Date;
        };
    } & {
        is_deleted: boolean;
        worker_id: number;
        close: Date | null;
        start: Date;
        attendance_id: number;
        alert: boolean;
        alert_text: string | null;
    }>;
    clockOut: (worker_id: number) => Promise<{
        worker: {
            person: {
                person_id: number;
                first_name: string;
                last_name: string;
                email: string;
                password: string | null;
                type: import("@final/db").$Enums.PersonType;
                tag: string | null;
                is_deleted: boolean;
            };
        } & {
            person_id: number;
            specialty: import("@final/db").$Enums.WorkerSpecialty;
            worker_id: number;
        };
        attendance: {
            is_deleted: boolean;
            day: string;
            status: boolean;
            attendance_id: number;
            work_date: Date;
        };
    } & {
        is_deleted: boolean;
        worker_id: number;
        close: Date | null;
        start: Date;
        attendance_id: number;
        alert: boolean;
        alert_text: string | null;
    }>;
    getTodayStatus: (worker_id: number) => Promise<{
        clocked_in: boolean;
        clocked_out: boolean;
        assist: ({
            worker: {
                person: {
                    person_id: number;
                    first_name: string;
                    last_name: string;
                    email: string;
                    password: string | null;
                    type: import("@final/db").$Enums.PersonType;
                    tag: string | null;
                    is_deleted: boolean;
                };
            } & {
                person_id: number;
                specialty: import("@final/db").$Enums.WorkerSpecialty;
                worker_id: number;
            };
            attendance: {
                is_deleted: boolean;
                day: string;
                status: boolean;
                attendance_id: number;
                work_date: Date;
            };
        } & {
            is_deleted: boolean;
            worker_id: number;
            close: Date | null;
            start: Date;
            attendance_id: number;
            alert: boolean;
            alert_text: string | null;
        }) | null;
    }>;
    getHistory: (filters: {
        worker_id?: number;
        date?: string;
    }) => Promise<({
        worker: {
            person: {
                person_id: number;
                first_name: string;
                last_name: string;
                email: string;
                password: string | null;
                type: import("@final/db").$Enums.PersonType;
                tag: string | null;
                is_deleted: boolean;
            };
        } & {
            person_id: number;
            specialty: import("@final/db").$Enums.WorkerSpecialty;
            worker_id: number;
        };
        attendance: {
            is_deleted: boolean;
            day: string;
            status: boolean;
            attendance_id: number;
            work_date: Date;
        };
    } & {
        is_deleted: boolean;
        worker_id: number;
        close: Date | null;
        start: Date;
        attendance_id: number;
        alert: boolean;
        alert_text: string | null;
    })[]>;
};
//# sourceMappingURL=punch.service.d.ts.map