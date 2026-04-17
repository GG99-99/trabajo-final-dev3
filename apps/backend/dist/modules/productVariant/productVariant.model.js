import prisma from "@final/db";
export const productVariantModel = {
    get: async (filters) => {
        return await prisma.productVariant.findUnique({
            where: { product_variant_id: filters.product_variant_id },
            include: { product: true },
        });
    },
    getMany: async (filters) => {
        const where = {};
        if (filters.product_id !== undefined)
            where.product_id = filters.product_id;
        if (filters.presentation !== undefined)
            where.presentation = filters.presentation;
        return await prisma.productVariant.findMany({
            where: Object.keys(where).length ? where : undefined,
            include: { product: true },
        });
    },
    create: async (data) => {
        return await prisma.productVariant.create({
            data: { ...data },
        });
    },
};
//# sourceMappingURL=productVariant.model.js.map