

export type AppointmentCreate = {
    worker_id: number;
    client_id: number;
    tattoo_id: number;
    start: string;
    end: string;
    date: Date;
}

export type AppointmentBlockTime = {
    start: string;
    end: string;
    duration: string;
}