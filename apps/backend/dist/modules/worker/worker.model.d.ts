export declare const workerModel: {
    get: (worker_id: number) => Promise<({
        person: {
            person_id: number;
            first_name: string;
            last_name: string;
            email: string;
            password: string | null;
            type: import("@prisma/index.js").$Enums.PersonType;
        };
    } & {
        person_id: number;
        specialty: import("@prisma/index.js").$Enums.WorkerSpecialty;
        worker_id: number;
    }) | null>;
    getMany: () => Promise<({
        person: {
            person_id: number;
            first_name: string;
            last_name: string;
            email: string;
            password: string | null;
            type: import("@prisma/index.js").$Enums.PersonType;
        };
    } & {
        person_id: number;
        specialty: import("@prisma/index.js").$Enums.WorkerSpecialty;
        worker_id: number;
    })[]>;
};
//# sourceMappingURL=worker.model.d.ts.map