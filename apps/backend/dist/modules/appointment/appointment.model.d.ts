import { AppointmentStatus } from "@prisma/index.js";
import { GetAppointmentFilters } from "@final/shared";
export declare const appointmentModel: {
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
};
//# sourceMappingURL=appointment.model.d.ts.map