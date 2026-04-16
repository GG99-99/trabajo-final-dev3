import { CreatePayment, GetPayment } from "@final/shared";
export declare const paymentService: {
    create: (data: CreatePayment) => Promise<PaymentWithRelations>;
    get: (filters: GetPayment) => Promise<any>;
    getMany: (filters: GetPayment) => Promise<PaymentWithRelations[]>;
};
//# sourceMappingURL=payment.service.d.ts.map