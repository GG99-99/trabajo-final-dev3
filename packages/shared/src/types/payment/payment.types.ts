import type { Prisma } from "@final/db";
import prisma from "@final/db";


/*******************
|   CREATE METHODS  |
 *******************/
export interface CreatePayment {
    bill_id: number;
    amount: number | string;
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
}

export interface GetManyPayment {
    bill_id?: number;
    date?: Date;
    relations?: boolean;
    
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