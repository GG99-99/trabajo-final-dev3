export type WorkerWithPerson = {
    worker_id: number;
    person_id: number;
    specialty: string;
    person: {
        person_id: number;
        first_name: string;
        last_name: string;
        email: string;
        password: string | null;
        type: string;
    };
} | null;
export type WorkerPublic = {
    worker_id: number;
    person_id: number;
    first_name: string;
    last_name: string;
    email: string;
    type: string;
    specialty: string;
};
//# sourceMappingURL=worker.types.d.ts.map