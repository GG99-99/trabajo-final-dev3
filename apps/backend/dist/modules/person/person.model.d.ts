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
        tag: string | null;
        is_deleted: boolean;
    } | null>;
    getDeleted: (email: string) => Promise<{
        person_id: number;
        first_name: string;
        last_name: string;
        email: string;
        password: string | null;
        type: import("@final/db").$Enums.PersonType;
        tag: string | null;
        is_deleted: boolean;
    } | null>;
    getMany: () => Promise<({
        cashier: {
            cashier_id: number;
            person_id: number;
        } | null;
        worker: {
            person_id: number;
            specialty: import("@final/db").$Enums.WorkerSpecialty;
            worker_id: number;
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
        tag: string | null;
        is_deleted: boolean;
    })[]>;
    softDelete: (person_id: number) => Promise<{
        person_id: number;
        first_name: string;
        last_name: string;
        email: string;
        password: string | null;
        type: import("@final/db").$Enums.PersonType;
        tag: string | null;
        is_deleted: boolean;
    }>;
    update: (person_id: number, data: {
        first_name?: string;
        last_name?: string;
        email?: string;
        password?: string;
        specialty?: string;
        medical_notes?: string;
    }) => Promise<{
        cashier: {
            cashier_id: number;
            person_id: number;
        } | null;
        worker: {
            person_id: number;
            specialty: import("@final/db").$Enums.WorkerSpecialty;
            worker_id: number;
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
        tag: string | null;
        is_deleted: boolean;
    }>;
    ban: (person_id: number, is_deleted: boolean) => Promise<{
        person_id: number;
        first_name: string;
        last_name: string;
        email: string;
        password: string | null;
        type: import("@final/db").$Enums.PersonType;
        tag: string | null;
        is_deleted: boolean;
    }>;
    restore: (person_id: number, data: Partial<CreatePerson>) => Promise<{
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
        password: string | null;
        type: import("@final/db").$Enums.PersonType;
        tag: string | null;
        is_deleted: boolean;
    }>;
    create: (personData: CreatePerson) => Promise<{
        person_id: number;
        first_name: string;
        last_name: string;
        email: string;
        password: string | null;
        type: import("@final/db").$Enums.PersonType;
        tag: string | null;
        is_deleted: boolean;
    }>;
};
//# sourceMappingURL=person.model.d.ts.map