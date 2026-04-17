import prisma, { type Prisma } from "@final/db";



export type AppointmentBlockTime = {
    start: string;
    end: string;
    duration: string;
}




/*******************
|   CREATE METHODS  |
 *******************/
export type CreateAppointment = {
    worker_id: number;
    client_id: number;
    tattoo_id: number;
    start: string;
    end: string;
    date: Date;

}

/*****************
|   READ METHODS  |
 *****************/
export type GetAppointmentFilters = {
    appointment_id?: number;
    worker_id?: number;
    client_id?: number;
    tattoo_id?: number;
    start?: string;
    end?: string;
    date?: Date;
    status?: "pending" | "completed" | "expired" | "cancelled";
}

export type GetBlocks = {
    date: Date;
    worker_id: number;
}


/************
|   OBJECTS  |
 ************/
export type AppointmentWithRelation = Prisma.Result<
    typeof prisma.appointment,
    {
        include: {
            client: true,
            worker: true,
            tattoo: true,
            bill: true

        };
    },
    'findUnique'
>;