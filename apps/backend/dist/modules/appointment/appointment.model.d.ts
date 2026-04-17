import { Prisma } from "@final/db";
import { AppointmentStatus } from "@final/db";
import { GetAppointmentFilters, CreateAppointment } from "@final/shared";
export declare const appointmentModel: {
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
    }>;
};
//# sourceMappingURL=appointment.model.d.ts.map