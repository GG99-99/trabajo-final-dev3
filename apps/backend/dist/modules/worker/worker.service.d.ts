import { WorkerPublic } from "@final/shared";
export declare const workerService: {
    get: (worker_id: number) => Promise<{
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
    }>;
    getMany: () => Promise<WorkerPublic[]>;
};
//# sourceMappingURL=worker.service.d.ts.map