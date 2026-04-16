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
        type: import("@prisma/index.js").$Enums.PersonType;
    } | null>;
    /***********
    |   CREATE  |
     ***********/
    create: (personData: CreatePerson) => Promise<{
        person_id: number;
        first_name: string;
        last_name: string;
        email: string;
        password: string | null;
        type: import("@prisma/index.js").$Enums.PersonType;
    }>;
};
//# sourceMappingURL=person.service.d.ts.map