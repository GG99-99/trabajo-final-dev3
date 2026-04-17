import type { PaymentMethod, Prisma } from "@final/db";
import prisma from "@final/db";


/*******************
|   CREATE METHODS  |
 *******************/
export interface CreatePayment {
    bill_id: number;
    cashier_id: number;
    amount: number;
    method: "cash" | "credit_card" | "transfer";
    transaction_ref: string;
}

/*****************
|   READ METHODS  |
 *****************/
export interface GetPayment {
    payment_id: number;
    bill_id?: number;
    date?: Date;
    relations?: boolean;
    is_refunded?: boolean;
}

export interface GetManyPayment {
    bill_id?: number;
    date?: Date;
    relations?: boolean;
    is_refunded?: boolean;

    
}

export interface GetManyPaymentByMonth {
    year: number; 
    month: number;
}

export type PaymentWithRelations = Prisma.Result<
    typeof prisma.payment,
    {
        include: {
            bill: true;
        };
    },
    'findUnique'
>;


/********************
|   OBJECT RESPONSE  |
 ********************/
export type PaymentSuccesfull =
| {
    bill_id: number;
    cashier_id: number;
    payment_id: number;
    devolution: number;
    amount_paid: number;
    debt: number;
    method: PaymentMethod;
}
