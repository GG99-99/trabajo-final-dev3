import prisma from "@final/db";
import { CreatePayment, GetPayment, GetManyPayment, PaymentWithRelations, GetManyPaymentByMonth } from "@final/shared";
import { toStartOfDay, toEndOfDay } from "#backend/utils";

export const paymentModel = {
    

    /*********
    |   READ  |
     *********/

    get: async (filters: GetPayment) => {

        return await prisma.payment.findUnique({
            where: { payment_id: filters.payment_id },
            
        });
    },

    getMany: async (filters: GetManyPayment)  => {
        return await prisma.payment.findMany({
            where: {
                ...(filters.bill_id && { bill_id: filters.bill_id }),
                ...(filters.date && {
                    create_at: {
                        gte: toStartOfDay(filters.date),
                        lte: toEndOfDay(filters.date),
                    },
                }),
            }
        });
    },

    getManyByMonth: async (filters: GetManyPaymentByMonth) => {
        // month va de 1-12 (enero=1, diciembre=12)
        const firstDay = new Date(filters.year, filters.month - 1, 1)
        const lastDay = new Date(filters.year, filters.month, 0)  // día 0 del mes siguiente = último día del mes actual

        return await prisma.payment.findMany({
            where: {
                create_at: {
                    gte: firstDay,
                    lte: lastDay,
                }
            },
            orderBy: {
                create_at: 'asc'
            }
        })
    }

    ,


    /***********
    |   CREATE  |
     ***********/
    create: async (data: CreatePayment): Promise<PaymentWithRelations> => {
        return await prisma.payment.create({
            data: {
                ...data
            },
            include: {
                bill: true,
            },
        });
    },
};
