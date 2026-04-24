import { WorkerWithPerson } from "@final/shared";
export declare const workerModel: {
    get: (worker_id: number) => Promise<({
        person: {
            person_id: number;
            first_name: string;
            last_name: string;
            email: string;
            password: string | null;
            type: import("@final/db").$Enums.PersonType;
            tag: string | null;
            is_deleted: boolean;
        };
    } & {
        person_id: number;
        specialty: import("@final/db").$Enums.WorkerSpecialty;
        worker_id: number;
    }) | null>;
    getMany: () => Promise<WorkerWithPerson[]>;
};
//# sourceMappingURL=worker.model.d.ts.map