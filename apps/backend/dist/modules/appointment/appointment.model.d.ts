import { Prisma } from "@final/db";
import { AppointmentStatus } from "@final/db";
import { GetAppointmentFilters, CreateAppointment, AppointmentWithRelation } from "@final/shared";
export declare const appointmentModel: {
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
};
//# sourceMappingURL=appointment.model.d.ts.map