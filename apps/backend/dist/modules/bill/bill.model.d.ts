import { BillWithRelations, GetManyBill, GetBill } from "@final/shared";
export declare const billModel: {
    get: (filters: GetBill) => Promise<BillWithRelations | null>;
    getMany: (filters: GetManyBill) => Promise<BillWithRelations[]>;
};
//# sourceMappingURL=bill.model.d.ts.map