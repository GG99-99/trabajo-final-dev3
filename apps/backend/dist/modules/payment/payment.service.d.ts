import { PaymentSuccesfull } from '@final/shared';
import { CreatePayment, GetPayment, GetManyPayment, GetManyPaymentByMonth } from "@final/shared";
export declare const paymentService: {
    /*********
    |   READ  |
     *********/
    get: (filters: GetPayment) => Promise<{
        cashier_id: number;
        create_at: Date;
        bill_id: number;
        payment_id: number;
        amount: import("@prisma/client/runtime/client").Decimal;
        method: import("@final/db").$Enums.PaymentMethod;
        transaction_ref: string;
        is_refunded: boolean;
    } | null>;
    getMany: (filters: GetManyPayment) => Promise<{
        cashier_id: number;
        create_at: Date;
        bill_id: number;
        payment_id: number;
        amount: import("@prisma/client/runtime/client").Decimal;
        method: import("@final/db").$Enums.PaymentMethod;
        transaction_ref: string;
        is_refunded: boolean;
    }[]>;
    getManyByMonth: (filters: GetManyPaymentByMonth) => Promise<{
        cashier_id: number;
        create_at: Date;
        bill_id: number;
        payment_id: number;
        amount: import("@prisma/client/runtime/client").Decimal;
        method: import("@final/db").$Enums.PaymentMethod;
        transaction_ref: string;
        is_refunded: boolean;
    }[]>;
    /***********
    |   CREATE  |
     ***********/
    create: (data: CreatePayment) => Promise<PaymentSuccesfull>;
};
//# sourceMappingURL=payment.service.d.ts.map