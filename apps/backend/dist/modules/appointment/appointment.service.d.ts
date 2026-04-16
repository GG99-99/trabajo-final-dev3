import { AppointmentStatus } from "@prisma/index.js";
import { AppointmentCreate, AppointmentBlockTime, GetAppointmentFilters } from "@final/shared";
export declare const appointmentService: {
    /***********
    |   CREATE  |
     ***********/
    create: (data: AppointmentCreate) => Promise<void>;
    /*********
    |   READ  |
     *********/
    getMany: (filters: GetAppointmentFilters) => Promise<{
        end: string;
        client_id: number;
        worker_id: number;
        appointment_id: number;
        tattoo_id: number;
        start: string;
        date: Date;
        create_at: Date;
        is_deleted: boolean;
        status: import("@prisma/index.js").$Enums.AppointmentStatus;
    }[]>;
    /***********
    |   UPDATE  |
     ***********/
    updateStatus: (appointment_id: number, status: AppointmentStatus) => Promise<{
        end: string;
        client_id: number;
        worker_id: number;
        appointment_id: number;
        tattoo_id: number;
        start: string;
        date: Date;
        create_at: Date;
        is_deleted: boolean;
        status: import("@prisma/index.js").$Enums.AppointmentStatus;
    }>;
    /****************
    |   PROGRAMMING  |
     ****************/
    getBlocks: (date: Date, worker_id: number) => Promise<AppointmentBlockTime[]>;
};
//# sourceMappingURL=appointment.service.d.ts.map