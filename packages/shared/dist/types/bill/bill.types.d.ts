import type { Prisma, $Enums, BillStatus } from "@final/db";
import prisma from "@final/db";
/*****************
|   READ METHODS  |
 *****************/
export interface GetManyBill {
    date?: Date;
    status?: $Enums.BillStatus;
    client_id?: number;
    cashier_id?: number;
    relations?: boolean;
}
export interface GetBill {
    bill_id: number;
    relations?: boolean;
}
/*******************
|   CREATE METHODS  |
 *******************/
export interface CreateFullBill {
    client_id?: number;
    worker_id: number;
    cashier_id: number;
    appointment_id?: number;
    create_at: Date;
    tatto_ids: number[];
    items: {
        product_variant_id: number;
        quantity: number;
    }[];
    payments: {
        create_at: Date;
        amount: number;
        method: "cash" | "credit_card" | "transfer";
        transaction_ref: string | null;
        is_refunded: boolean;
    }[];
    extra: {
        aggregates: {
            amount: number;
            reason: string;
        }[];
        discounts: {
            amount: number;
            reason: string;
        }[];
    };
}
export interface CreateBillAggregate {
    bill_id: number;
    amount: number;
    reason: string;
}
export interface CreateBillDiscount {
    bill_id: number;
    amount: number;
    reason: string;
}
export interface CreateBill {
    client_id?: number;
    worker_id: number;
    cashier_id: number;
    appointment_id?: number;
    create_at: Date;
    payments?: {
        create_at: Date;
        amount: number;
        method: "cash" | "credit_card" | "transfer";
        transaction_ref: string | null;
        is_refunded: boolean;
    }[];
}
export interface CreateBillDetail {
    bill_id: number;
    stock_movement_id: number;
}
export interface CreateBillTattoo {
    tattoo_id: number;
    bill_id: number;
}
/*******************
|   UPDATE METHODS  |
 *******************/
export interface UpdateBillStatus {
    bill_id: number;
    status: BillStatus;
}
/****************
|   OBJECT TYPE  |
 ****************/
export type BillWithRelations = Prisma.Result<typeof prisma.bill, {
    include: {
        details: true;
        tattoos: true;
        payments: true;
        aggregates: true;
        discounts: true;
        client: {
            include: {
                person: true;
            };
        };
        worker: {
            include: {
                person: true;
            };
        };
    };
}, 'findUnique'>;
export type BillProductItem = {
    product_name: string;
    presentation: string;
    price: number;
    stock_movement_quantity: number;
    inventory_item_id: number;
};
export type BillTattooItem = {
    tattoo_id: number;
    price: number;
};
export type BillFinance = {
    bill_id: number;
    total: number;
    total_discount: number;
    total_after_discount: number;
    debt: number;
    overpaid: number;
};
//# sourceMappingURL=bill.types.d.ts.map