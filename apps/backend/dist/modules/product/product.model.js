import prisma from "@final/db";
export const productModel = {
    get: async (filters) => {
        return await prisma.product.findUnique({
            where: { product_id: filters.product_id },
            include: { variants: true },
        });
    },
    getMany: async (filters) => {
        const where = {};
        if (filters.provider_id !== undefined)
            where.provider_id = filters.provider_id;
        if (filters.category_id !== undefined)
            where.category_id = filters.category_id;
        return await prisma.product.findMany({
            where: Object.keys(where).length ? where : undefined,
            include: { variants: true },
        });
    },
    create: async (data) => {
        return await prisma.product.create({
            data: { ...data },
        });
    },
};
//# sourceMappingURL=product.model.js.map