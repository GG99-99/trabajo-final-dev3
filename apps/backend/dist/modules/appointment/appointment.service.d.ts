import { AppointmentStatus, Prisma } from "@final/db";
import { AppointmentBlockTime, ScheduleJsonDay, GetAppointmentFilters, GetBlocks, CreateAppointment, AppointmentWithRelation } from "@final/shared";
export declare const appointmentService: {
    /***********
    |   CREATE  |
     ***********/
    create: (data: CreateAppointment) => Promise<{
        is_deleted: boolean;
        worker_id: number;
        client_id: number;
        end: string;
        appointment_id: number;
        tattoo_id: number;
        start: string;
        date: Date;
        create_at: Date;
        status: import("@final/db").$Enums.AppointmentStatus;
    }>;
    /*********
    |   READ  |
     *********/
    getMany: (filters: GetAppointmentFilters) => Promise<AppointmentWithRelation[]>;
    /***********
    |   UPDATE  |
     ***********/
    updateStatus: (appointment_id: number, status: AppointmentStatus, tx: Prisma.TransactionClient) => Promise<{
        is_deleted: boolean;
        worker_id: number;
        client_id: number;
        end: string;
        appointment_id: number;
        tattoo_id: number;
        start: string;
        date: Date;
        create_at: Date;
        status: import("@final/db").$Enums.AppointmentStatus;
    }>;
    updateStatusDirect: (appointment_id: number, status: AppointmentStatus) => Promise<{
        is_deleted: boolean;
        worker_id: number;
        client_id: number;
        end: string;
        appointment_id: number;
        tattoo_id: number;
        start: string;
        date: Date;
        create_at: Date;
        status: import("@final/db").$Enums.AppointmentStatus;
    }>;
    /****************
    |   PROGRAMMING  |
     ****************/
    getBlocks: ({ date, worker_id }: GetBlocks) => Promise<AppointmentBlockTime[]>;
    applyRestrictions: (blocks: AppointmentBlockTime[], daySchedule: ScheduleJsonDay) => AppointmentBlockTime[];
};
//# sourceMappingURL=appointment.service.d.ts.map