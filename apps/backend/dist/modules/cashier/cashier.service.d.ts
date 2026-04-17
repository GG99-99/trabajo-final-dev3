import { CashierPublic, CreatePerson } from "@final/shared";
export declare const cashierService: {
    get: (cashier_id: number) => Promise<({
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
        cashier_id: number;
    }) | null>;
    getMany: () => Promise<CashierPublic[]>;
    create: (data: CreatePerson) => Promise<{
        person_id: number;
        first_name: string;
        last_name: string;
        email: string;
        password: string | null;
        type: import("@prisma/client").$Enums.PersonType;
    }>;
};
//# sourceMappingURL=cashier.service.d.ts.map