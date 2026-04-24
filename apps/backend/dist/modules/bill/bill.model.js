import prisma from "@final/db";
import { toStartOfDay, toEndOfDay } from "#backend/utils";
export const billModel = {
    /*********
    |   READ  |
     *********/
    get: async (filters) => {
        return await prisma.bill.findUnique({
            where: { bill_id: filters.bill_id },
            include: {
                details: filters.relations || undefined,
                tattoos: filters.relations || undefined,
                payments: filters.relations || undefined,
                aggregates: filters.relations || undefined,
                discounts: filters.relations || undefined,
                client: {
                    include: { person: filters.relations || undefined }
                },
                worker: {
                    include: { person: filters.relations || undefined }
                },
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
                details: true,
                tattoos: true,
                payments: true,
                aggregates: true,
                discounts: true,
                client: {
                    include: { person: true }
                },
                worker: {
                    include: { person: true }
                },
            }
        });
    },
    getStockMovements: async (bill_id) => {
        const billProducts = await prisma.billDetail.findMany({
            where: {
                bill_id: bill_id,
            },
            select: {
                stockMovement: {
                    select: {
                        quantity: true,
                        inventory_item_id: true,
                        inventoryItem: {
                            select: {
                                productVariant: {
                                    select: {
                                        presentation: true,
                                        price: true,
                                        product: {
                                            select: {
                                                name: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
        const result = billProducts
            .filter((detail) => detail.stockMovement !== null)
            .map((detail) => ({
            product_name: detail.stockMovement.inventoryItem.productVariant.product.name,
            presentation: detail.stockMovement.inventoryItem.productVariant.presentation,
            price: Number(detail.stockMovement.inventoryItem.productVariant.price),
            stock_movement_quantity: Number(detail.stockMovement.quantity),
            inventory_item_id: detail.stockMovement.inventory_item_id,
        }));
        return result;
    },
    getTattoos: async (bill_id) => {
        const billTattoos = await prisma.billTattoo.findMany({
            where: {
                bill_id: bill_id,
            },
            select: {
                tattoo: {
                    select: {
                        tattoo_id: true,
                        cost: true,
                    },
                },
            },
        });
        const result = billTattoos
            .filter((detail) => detail.tattoo !== null)
            .map((detail) => ({
            tattoo_id: detail.tattoo.tattoo_id,
            price: Number(detail.tattoo.cost),
        }));
        return result;
    },
    /***********
    |   CREATE  |
     ***********/
    create: async (data, tx) => {
        const { payments, ...rest } = data;
        return await tx.bill.create({
            data: {
                ...rest,
                payments: payments ? {
                    create: payments.map(payment => ({
                        cashier_id: data.cashier_id,
                        create_at: payment.create_at,
                        amount: payment.amount,
                        method: payment.method,
                        transaction_ref: payment.transaction_ref,
                        is_refunded: payment.is_refunded
                    }))
                } : undefined
            },
            include: {
                payments: true
            }
        });
    },
    createBillDetail: async (data, tx) => {
        return await tx.billDetail.create({
            data: { ...data }
        });
    },
    createBillTatto: async (data, tx) => {
        return await tx.billTattoo.create({
            data: {
                ...data
            }
        });
    },
    createBillAggregate: async (data, tx) => {
        return await tx.billAggregate.create({
            data: { ...data }
        });
    },
    createBillDiscount: async (data, tx) => {
        return await tx.billDiscount.create({
            data: { ...data }
        });
    },
    /***********
    |   UPDATE  |
     ***********/
    updateStatus: async (data, tx) => {
        return await tx.bill.update({
            where: { bill_id: data.bill_id },
            data: {
                status: data.status
            }
        });
    }
};
//# sourceMappingURL=bill.model.js.map