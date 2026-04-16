import { CreatePayment, GetPayment, PaymentWithRelations } from "@final/shared";
export declare const paymentModel: {
    create: (data: CreatePayment) => Promise<PaymentWithRelations>;
    get: (filters: GetPayment) => Promise<PaymentWithRelations | null>;
    getMany: (filters: GetPayment) => Promise<PaymentWithRelations[]>;
};
//# sourceMappingURL=payment.model.d.ts.map