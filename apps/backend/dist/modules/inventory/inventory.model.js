import prisma from "@final/db";
export const inventoryModel = {
    /*********
    |   READ  |
     *********/
    get: async (filters, tx) => {
        const client = tx ?? prisma;
        return await client.inventoryItem.findUnique({
            where: {
                inventory_item_id: filters.inventory_item_id,
                ...(filters.gte && { current_quantity: { gte: filters.gte } })
            }
        });
    },
    getTotalQuantity: async (filters) => {
        return await prisma.inventoryItem.aggregate({
            _sum: {
                current_quantity: true,
            },
            where: {
                product_variant_id: filters.product_variant_id,
                OR: [
                    { expiry_date: null }, // sin fecha de expiración
                    { expiry_date: { gt: new Date() } }, // no han expirado
                ],
            },
        });
    },
    getNotExpired: async (filters, tx) => {
        const client = tx ?? prisma;
        return await client.inventoryItem.findFirst({
            where: {
                product_variant_id: filters.product_variant_id,
                current_quantity: { gt: 0 },
                OR: [
                    { expiry_date: null },
                    { expiry_date: { gt: new Date() } },
                ],
            },
            include: { productVariant: true }
        });
    },
    getManyNotExpired: async (filters) => {
        return await prisma.inventoryItem.findMany({
            where: {
                product_variant_id: filters.product_variant_id,
                current_quantity: filters.gte
                    ? { gte: filters.gte }
                    : { gte: 0 },
                OR: [
                    { expiry_date: null },
                    { expiry_date: { gt: new Date() } },
                ],
            },
            include: { productVariant: true }
        });
    },
    /***********
    |   UPDATE  |
     ***********/
    updateQuantity: async (data, tx) => {
        return await tx.inventoryItem.update({
            where: { inventory_item_id: data.inventory_item_id },
            data: {
                current_quantity: data.type === "entry"
                    ? { increment: data.quantity }
                    : { decrement: data.quantity }
            }
        });
    },
    /***********
    |   CREATE  |
     ***********/
    create: async (data, tx) => {
        return await tx.inventoryItem.create({
            data: {
                product_variant_id: data.product_variant_id,
                batch_number: data.batch_number,
                current_quantity: 0, // se crea con cero, lo actualiza el stockMovement
                expiry_date: data.expiry_date
            }
        });
    }
};
//# sourceMappingURL=inventory.model.js.map