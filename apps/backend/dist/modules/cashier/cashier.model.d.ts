export declare const cashierModel: {
    /*********
    |   READ  |
     *********/
    get: (cashier_id: number) => Promise<({
        person: {
            person_id: number;
            first_name: string;
            last_name: string;
            email: string;
            password: string | null;
            type: import("@prisma/index.js").$Enums.PersonType;
        };
    } & {
        person_id: number;
        cashier_id: number;
    }) | null>;
    getMany: () => Promise<({
        person: {
            person_id: number;
            first_name: string;
            last_name: string;
            email: string;
            password: string | null;
            type: import("@prisma/index.js").$Enums.PersonType;
        };
    } & {
        person_id: number;
        cashier_id: number;
    })[]>;
    /***********
    |   CREATE  |
     ***********/
    create: () => Promise<void>;
};
//# sourceMappingURL=cashier.model.d.ts.map