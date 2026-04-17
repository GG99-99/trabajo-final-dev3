import prisma from "@final/db";
export const inventoryModel = {
    /*********
    |   READ  |
     *********/
    get: async (filters) => {
        return await prisma.inventoryItem.findUnique({
            where: { inventory_item_id: filters.inventory_item_id }
        });
    },
    getQuantity: async (filters) => {
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
    getExpired: async (filters) => {
        return await prisma.inventoryItem.findMany({
            where: {
                product_variant_id: filters.product_variant_id,
                current_quantity: { gt: 0 },
                OR: [
                    { expiry_date: null }, // sin fecha de expiración
                    { expiry_date: { lt: new Date() } },
                    // no han expirado
                ],
            },
            include: { productVariant: true }
        });
    }
};
//# sourceMappingURL=inventory.model.js.map