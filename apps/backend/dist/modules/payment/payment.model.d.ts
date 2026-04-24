import { type Prisma } from "@final/db";
import { CreatePayment, GetPayment, GetManyPayment, PaymentWithRelations, GetManyPaymentByMonth } from "@final/shared";
export declare const paymentModel: {
    /*********
    |   READ  |
     *********/
    get: (filters: GetPayment) => Promise<{
        cashier_id: number;
        create_at: Date;
        bill_id: number;
        method: import("@final/db").$Enums.PaymentMethod;
        payment_id: number;
        amount: Prisma.Decimal;
        transaction_ref: string | null;
        is_refunded: boolean;
    } | null>;
    getMany: (filters: GetManyPayment) => Promise<{
        cashier_id: number;
        create_at: Date;
        bill_id: number;
        method: import("@final/db").$Enums.PaymentMethod;
        payment_id: number;
        amount: Prisma.Decimal;
        transaction_ref: string | null;
        is_refunded: boolean;
    }[]>;
    getManyByMonth: (filters: GetManyPaymentByMonth) => Promise<{
        cashier_id: number;
        create_at: Date;
        bill_id: number;
        method: import("@final/db").$Enums.PaymentMethod;
        payment_id: number;
        amount: Prisma.Decimal;
        transaction_ref: string | null;
        is_refunded: boolean;
    }[]>;
    /***********
    |   CREATE  |
     ***********/
    create: (data: CreatePayment, tx: Prisma.TransactionClient) => Promise<PaymentWithRelations>;
};
//# sourceMappingURL=payment.model.d.ts.map