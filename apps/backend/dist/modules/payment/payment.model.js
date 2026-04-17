import prisma from "@final/db";
import { toStartOfDay, toEndOfDay } from "#backend/utils";
export const paymentModel = {
    create: async (data) => {
        return await prisma.payment.create({
            data: {
                bill_id: data.bill_id,
                amout: data.amout,
                method: data.method,
                transaction_ref: data.transaction_ref,
            },
            include: {
                bill: true,
            },
        });
    },
    get: async (filters) => {
        if (!filters.payment_id)
            return null;
        return await prisma.payment.findUnique({
            where: { payment_id: filters.payment_id },
            include: {
                bill: true,
            },
        });
    },
    getMany: async (filters) => {
        return await prisma.payment.findMany({
            where: {
                ...(filters.bill_id && { bill_id: filters.bill_id }),
                ...(filters.date && {
                    create_at: {
                        gte: toStartOfDay(filters.date),
                        lte: toEndOfDay(filters.date),
                    },
                }),
            },
            include: {
                bill: true,
            },
        });
    },
};
//# sourceMappingURL=payment.model.js.map