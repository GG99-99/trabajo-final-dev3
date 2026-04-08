import { AppointmentStatus } from "@prisma/index.js";

export interface AppointmentFilters {
    appointment_id?: number;
    worker_id?: number;
    client_id?: number;
    tattoo_id?: number;
    start?: string;
    end?: string;
    date?: Date;
    status?: AppointmentStatus;
}

