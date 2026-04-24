import { toEndOfDay, toStartOfDay } from "#backend/utils";
import prisma from "@final/db";
export const stockMovementModel = {
    get: async (filters, tx) => {
        const client = tx ?? prisma;
        return await client.stockMovement.findFirst({
            where: {
                ...(filters.stock_movement_id && { stock_movement_id: filters.stock_movement_id }),
                ...(filters.inventory_item_id && { inventory_item_id: filters.inventory_item_id }),
                ...(filters.create_at && { create_at: {
                        gt: toStartOfDay(filters.create_at),
                        lt: toEndOfDay(filters.create_at)
                    } }),
                ...(filters.quantity && { quantity: filters.quantity }),
                ...(filters.type && { type: filters.type }),
            },
            include: {
                inventoryItem: {
                    include: {
                        productVariant: true
                    }
                }
            }
        });
    },
    getMany: async (filters) => {
        return await prisma.stockMovement.findMany({
            where: {
                ...(filters.inventory_item_id && { inventory_item_id: filters.inventory_item_id }),
                ...(filters.create_at && { create_at: {
                        gt: toStartOfDay(filters.create_at),
                        lt: toEndOfDay(filters.create_at)
                    } }),
                ...(filters.quantity && { quantity: filters.quantity }),
                ...(filters.type && { type: filters.type }),
            }
        });
    },
    /***********
    |   CREATE  |
     ***********/
    create: async (data, tx) => {
        // crear el stockMovement
        return await tx.stockMovement.create({
            data: { ...data }
        });
    }
};
//# sourceMappingURL=stockMovement.model.js.map