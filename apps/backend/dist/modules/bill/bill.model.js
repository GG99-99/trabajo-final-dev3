import prisma from "@final/db";
import { toStartOfDay, toEndOfDay } from "#backend/utils";
export const billModel = {
    get: async (filters) => {
        return await prisma.bill.findUnique({
            where: { bill_id: filters.bill_id },
            include: {
                billDetails: true,
                billTattoos: true,
                payments: true
            }
        });
    },
    getMany: async (filters) => {
        return await prisma.bill.findMany({
            where: {
                ...(filters.date && { create_at: {
                        gte: toStartOfDay(filters.date),
                        lte: toEndOfDay(filters.date),
                    } }),
                ...(filters.status && { status: filters.status }),
                ...(filters.client_id && { client_id: filters.client_id }),
                ...(filters.cashier_id && { cashier_id: filters.cashier_id }),
            },
            include: {
                billDetails: true,
                billTattoos: true,
                payments: true
            }
        });
    }
};
//# sourceMappingURL=bill.model.js.map