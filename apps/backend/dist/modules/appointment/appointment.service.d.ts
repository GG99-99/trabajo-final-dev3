import { AppointmentStatus, Prisma } from "@final/db";
import { AppointmentBlockTime, ScheduleJsonDay, GetAppointmentFilters, GetBlocks, CreateAppointment } from "@final/shared";
export declare const appointmentService: {
    /***********
    |   CREATE  |
     ***********/
    create: (data: CreateAppointment) => Promise<{
        client_id: number;
        worker_id: number;
        end: string;
        appointment_id: number;
        tattoo_id: number;
        start: string;
        date: Date;
        create_at: Date;
        is_deleted: boolean;
        status: import("@final/db").$Enums.AppointmentStatus;
    } | null>;
    /*********
    |   READ  |
     *********/
    getMany: (filters: GetAppointmentFilters) => Promise<{
        client_id: number;
        worker_id: number;
        end: string;
        appointment_id: number;
        tattoo_id: number;
        start: string;
        date: Date;
        create_at: Date;
        is_deleted: boolean;
        status: import("@final/db").$Enums.AppointmentStatus;
    }[]>;
    /***********
    |   UPDATE  |
     ***********/
    updateStatus: (appointment_id: number, status: AppointmentStatus, tx: Prisma.TransactionClient) => Promise<{
        client_id: number;
        worker_id: number;
        end: string;
        appointment_id: number;
        tattoo_id: number;
        start: string;
        date: Date;
        create_at: Date;
        is_deleted: boolean;
        status: import("@final/db").$Enums.AppointmentStatus;
    }>;
    updateStatusDirect: (appointment_id: number, status: AppointmentStatus) => Promise<{
        client_id: number;
        worker_id: number;
        end: string;
        appointment_id: number;
        tattoo_id: number;
        start: string;
        date: Date;
        create_at: Date;
        is_deleted: boolean;
        status: import("@final/db").$Enums.AppointmentStatus;
    }>;
    /****************
    |   PROGRAMMING  |
     ****************/
    getBlocks: ({ date, worker_id }: GetBlocks) => Promise<AppointmentBlockTime[]>;
    applyRestrictions: (blocks: AppointmentBlockTime[], daySchedule: ScheduleJsonDay) => AppointmentBlockTime[];
};
//# sourceMappingURL=appointment.service.d.ts.map