import { GetManyBill, GetBill, CreateFullBill, CreateBillTattoo, UpdateBillStatus, BillFinance } from "@final/shared";
import { Prisma } from "@final/db";
export declare const billService: {
    getMany: (filters: GetManyBill) => Promise<(({
        payments: {
            cashier_id: number;
            create_at: Date;
            bill_id: number;
            payment_id: number;
            amount: Prisma.Decimal;
            method: import("@final/db").$Enums.PaymentMethod;
            transaction_ref: string;
            is_refunded: boolean;
        }[];
        details: {
            stock_movement_id: number;
            bill_id: number;
            bill_detail_id: number;
        }[];
        tattoos: {
            tattoo_id: number;
            bill_id: number;
        }[];
        aggregates: {
            reason: string;
            bill_id: number;
            amount: Prisma.Decimal;
            bill_aggregate_id: number;
        }[];
        discounts: {
            reason: string;
            bill_id: number;
            amount: Prisma.Decimal;
            bill_discount_id: number;
        }[];
    } & {
        client_id: number;
        worker_id: number;
        cashier_id: number;
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
            payment_id: number;
            amount: Prisma.Decimal;
            method: import("@final/db").$Enums.PaymentMethod;
            transaction_ref: string;
            is_refunded: boolean;
        }[];
        details: {
            stock_movement_id: number;
            bill_id: number;
            bill_detail_id: number;
        }[];
        tattoos: {
            tattoo_id: number;
            bill_id: number;
        }[];
        aggregates: {
            reason: string;
            bill_id: number;
            amount: Prisma.Decimal;
            bill_aggregate_id: number;
        }[];
        discounts: {
            reason: string;
            bill_id: number;
            amount: Prisma.Decimal;
            bill_discount_id: number;
        }[];
    } & {
        client_id: number;
        worker_id: number;
        cashier_id: number;
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
        client_id: number;
        worker_id: number;
        cashier_id: number;
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
        client_id: number;
        worker_id: number;
        cashier_id: number;
        appointment_id: number | null;
        create_at: Date;
        status: import("@final/db").$Enums.BillStatus;
        bill_id: number;
    }>;
    updateStateDirect: (data: UpdateBillStatus) => Promise<{
        client_id: number;
        worker_id: number;
        cashier_id: number;
        appointment_id: number | null;
        create_at: Date;
        status: import("@final/db").$Enums.BillStatus;
        bill_id: number;
    }>;
};
//# sourceMappingURL=bill.service.d.ts.map