import { Prisma } from "@final/db";
import { BillWithRelations, GetManyBill, GetBill, CreateBill, CreateBillTattoo, CreateBillDetail, UpdateBillStatus, CreateBillAggregate, CreateBillDiscount, BillProductItem, BillTattooItem } from "@final/shared";
export declare const billModel: {
    /*********
    |   READ  |
     *********/
    get: (filters: GetBill) => Promise<BillWithRelations | null>;
    getMany: (filters: GetManyBill) => Promise<BillWithRelations[]>;
    getStockMovements: (bill_id: number) => Promise<BillProductItem[]>;
    getTattoos: (bill_id: number) => Promise<BillTattooItem[]>;
    /***********
    |   CREATE  |
     ***********/
    create: (data: CreateBill, tx: Prisma.TransactionClient) => Promise<{
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
    createBillDetail: (data: CreateBillDetail, tx: Prisma.TransactionClient) => Promise<{
        bill_id: number;
        stock_movement_id: number;
        bill_detail_id: number;
    }>;
    createBillTatto: (data: CreateBillTattoo, tx: Prisma.TransactionClient) => Promise<{
        tattoo_id: number;
        bill_id: number;
    }>;
    createBillAggregate: (data: CreateBillAggregate, tx: Prisma.TransactionClient) => Promise<{
        bill_id: number;
        reason: string;
        amount: Prisma.Decimal;
        bill_aggregate_id: number;
    }>;
    createBillDiscount: (data: CreateBillDiscount, tx: Prisma.TransactionClient) => Promise<{
        bill_id: number;
        reason: string;
        amount: Prisma.Decimal;
        bill_discount_id: number;
    }>;
    /***********
    |   UPDATE  |
     ***********/
    updateStatus: (data: UpdateBillStatus, tx: Prisma.TransactionClient) => Promise<{
        cashier_id: number;
        worker_id: number;
        client_id: number | null;
        appointment_id: number | null;
        create_at: Date;
        status: import("@final/db").$Enums.BillStatus;
        bill_id: number;
    }>;
};
//# sourceMappingURL=bill.model.d.ts.map