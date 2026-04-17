import { CreatePerson } from "@final/shared";
import { GetPerson } from "@final/shared";
export declare const personModel: {
    get: (filters: GetPerson) => Promise<{
        person_id: number;
        first_name: string;
        last_name: string;
        email: string;
        password: string | null;
        type: import("@final/db").$Enums.PersonType;
    } | null>;
    getMany: () => Promise<({
        worker: {
            person_id: number;
            specialty: import("@final/db").$Enums.WorkerSpecialty;
            worker_id: number;
        } | null;
        cashier: {
            person_id: number;
            cashier_id: number;
        } | null;
        client: {
            person_id: number;
            medical_notes: string | null;
            client_id: number;
        } | null;
    } & {
        person_id: number;
        first_name: string;
        last_name: string;
        email: string;
        type: import("@final/db").$Enums.PersonType;
    })[]>;
    create: (personData: CreatePerson) => Promise<{
        person_id: number;
        first_name: string;
        last_name: string;
        email: string;
        password: string | null;
        type: import("@final/db").$Enums.PersonType;
    }>;
};
//# sourceMappingURL=person.model.d.ts.map