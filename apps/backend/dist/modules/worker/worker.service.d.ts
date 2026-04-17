import { WorkerPublic } from "@final/shared";
export declare const workerService: {
    get: (worker_id: number) => Promise<{
        person: {
            person_id: number;
            first_name: string;
            last_name: string;
            email: string;
            password: string | null;
            type: import("@prisma/client").$Enums.PersonType;
        };
    } & {
        person_id: number;
        specialty: import("@prisma/client").$Enums.WorkerSpecialty;
        worker_id: number;
    }>;
    getMany: () => Promise<WorkerPublic[]>;
};
//# sourceMappingURL=worker.service.d.ts.map