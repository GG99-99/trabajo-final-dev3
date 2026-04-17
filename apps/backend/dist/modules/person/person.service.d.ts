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
    } | null>;
    getMany: () => Promise<({
        worker: {
            person_id: number;
            specialty: import("@prisma/client").$Enums.WorkerSpecialty;
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
        type: import("@prisma/client").$Enums.PersonType;
    })[]>;
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
    }>;
};
//# sourceMappingURL=person.service.d.ts.map