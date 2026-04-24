import { CreatePerson, GetPerson } from "@final/shared";
export declare const personService: {
    /*********
    |   READ  |
     *********/
    get: (filters: GetPerson) => Promise<{
        person_id: number;
        first_name: string;
        last_name: string;
        email: string;
        password: string | null;
        type: import("@prisma/client").$Enums.PersonType;
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
            specialty: import("@prisma/client").$Enums.WorkerSpecialty;
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
        type: import("@prisma/client").$Enums.PersonType;
        tag: string | null;
        is_deleted: boolean;
    })[]>;
    /***********
    |   UPDATE  |
     ***********/
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
            specialty: import("@prisma/client").$Enums.WorkerSpecialty;
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
        type: import("@prisma/client").$Enums.PersonType;
        tag: string | null;
        is_deleted: boolean;
    }>;
    /***********
    |   DELETE  |
     ***********/
    softDelete: (person_id: number) => Promise<{
        person_id: number;
        first_name: string;
        last_name: string;
        email: string;
        password: string | null;
        type: import("@prisma/client").$Enums.PersonType;
        tag: string | null;
        is_deleted: boolean;
    }>;
    ban: (person_id: number, banned: boolean) => Promise<{
        person_id: number;
        first_name: string;
        last_name: string;
        email: string;
        password: string | null;
        type: import("@prisma/client").$Enums.PersonType;
        tag: string | null;
        is_deleted: boolean;
    }>;
    /***********
    |   CREATE  |
     ***********/
    create: (personData: CreatePerson) => Promise<{
        person_id: number;
        first_name: string;
        last_name: string;
        email: string;
        password: string | null;
        type: import("@prisma/client").$Enums.PersonType;
        tag: string | null;
        is_deleted: boolean;
    }>;
};
//# sourceMappingURL=person.service.d.ts.map