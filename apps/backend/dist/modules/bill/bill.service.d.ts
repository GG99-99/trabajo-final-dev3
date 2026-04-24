import { GetManyBill, GetBill, CreateFullBill, CreateBillTattoo, UpdateBillStatus, BillFinance } from "@final/shared";
import { Prisma } from "@final/db";
export declare const billService: {
    getMany: (filters: GetManyBill) => Promise<(({
        payments: {
            cashier_id: number;
            create_at: Date;
            bill_id: number;
            method: import("@final/db").$Enums.PaymentMethod;
            payment_id: number;
            amount: Prisma.Decimal;
            transaction_ref: string | null;
            is_refunded: boolean;
        }[];
        worker: {
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
        };
        client: ({
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
            medical_notes: string | null;
            client_id: number;
        }) | null;
        details: {
            bill_id: number;
            stock_movement_id: number;
            bill_detail_id: number;
        }[];
        tattoos: {
            tattoo_id: number;
            bill_id: number;
        }[];
        discounts: {
            bill_id: number;
            reason: string;
            amount: Prisma.Decimal;
            bill_discount_id: number;
        }[];
        aggregates: {
            bill_id: number;
            reason: string;
            amount: Prisma.Decimal;
            bill_aggregate_id: number;
        }[];
    } & {
        cashier_id: number;
        worker_id: number;
        client_id: number | null;
        appointment_id: number | null;
        create_at: Date;
        status: import("@final/db").$Enums.BillStatus;
        bill_id: number;
    }) | null)[]>;
    get: (filters: GetBill) => Promise<({
        payments: {
            cashier_id: number;
            create_at: Date;
            bill_id: number;
            method: import("@final/db").$Enums.PaymentMethod;
            payment_id: number;
            amount: Prisma.Decimal;
            transaction_ref: string | null;
            is_refunded: boolean;
        }[];
        worker: {
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
        };
        client: ({
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
            medical_notes: string | null;
            client_id: number;
        }) | null;
        details: {
            bill_id: number;
            stock_movement_id: number;
            bill_detail_id: number;
        }[];
        tattoos: {
            tattoo_id: number;
            bill_id: number;
        }[];
        discounts: {
            bill_id: number;
            reason: string;
            amount: Prisma.Decimal;
            bill_discount_id: number;
        }[];
        aggregates: {
            bill_id: number;
            reason: string;
            amount: Prisma.Decimal;
            bill_aggregate_id: number;
        }[];
    } & {
        cashier_id: number;
        worker_id: number;
        client_id: number | null;
        appointment_id: number | null;
        create_at: Date;
        status: import("@final/db").$Enums.BillStatus;
        bill_id: number;
    }) | null>;
    getTotal: (bill_id: number) => Promise<BillFinance>;
    getStockMovements: (bill_id: number) => Promise<import("@final/shared").BillProductItem[]>;
    getTattoos: (bill_id: number) => Promise<import("@final/shared").BillTattooItem[]>;
    /***********
    |   CREATE  |
     ***********/
    create: (data: CreateFullBill) => Promise<{
        payments: {
            cashier_id: number;
            create_at: Date;
            bill_id: number;
            method: import("@final/db").$Enums.PaymentMethod;
            payment_id: number;
            amount: Prisma.Decimal;
            transaction_ref: string | null;
            is_refunded: boolean;
        }[];
    } & {
        cashier_id: number;
        worker_id: number;
        client_id: number | null;
        appointment_id: number | null;
        create_at: Date;
        status: import("@final/db").$Enums.BillStatus;
        bill_id: number;
    }>;
    createBillTattoo: (data: CreateBillTattoo, tx: Prisma.TransactionClient) => Promise<{
        tattoo_id: number;
        bill_id: number;
    }>;
    /***********
    |   UPDATE  |
     ***********/
    updateState: (data: UpdateBillStatus, tx: Prisma.TransactionClient) => Promise<{
        cashier_id: number;
        worker_id: number;
        client_id: number | null;
        appointment_id: number | null;
        create_at: Date;
        status: import("@final/db").$Enums.BillStatus;
        bill_id: number;
    }>;
    updateStateDirect: (data: UpdateBillStatus) => Promise<{
        cashier_id: number;
        worker_id: number;
        client_id: number | null;
        appointment_id: number | null;
        create_at: Date;
        status: import("@final/db").$Enums.BillStatus;
        bill_id: number;
    }>;
};
//# sourceMappingURL=bill.service.d.ts.map