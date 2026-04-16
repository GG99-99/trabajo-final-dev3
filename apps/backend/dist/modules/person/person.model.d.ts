import { CreatePerson } from "@final/shared";
import { GetPerson } from "@final/shared";
export declare const personModel: {
    get: (filters: GetPerson) => Promise<{
        person_id: number;
        first_name: string;
        last_name: string;
        email: string;
        password: string | null;
        type: import("@prisma/index.js").$Enums.PersonType;
    } | null>;
    create: (personData: CreatePerson) => Promise<{
        person_id: number;
        first_name: string;
        last_name: string;
        email: string;
        password: string | null;
        type: import("@prisma/index.js").$Enums.PersonType;
    }>;
};
//# sourceMappingURL=person.model.d.ts.map