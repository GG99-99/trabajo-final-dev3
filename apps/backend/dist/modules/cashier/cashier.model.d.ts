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
            type: import("@final/db").$Enums.PersonType;
            tag: string | null;
            is_deleted: boolean;
        };
    } & {
        cashier_id: number;
        person_id: number;
    }) | null>;
    getMany: () => Promise<({
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
        cashier_id: number;
        person_id: number;
    })[]>;
    /***********
    |   CREATE  |
     ***********/
    create: () => Promise<void>;
};
//# sourceMappingURL=cashier.model.d.ts.map