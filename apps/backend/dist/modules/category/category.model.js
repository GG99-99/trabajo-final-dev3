import prisma from "@final/db";
export const categoryModel = {
    get: async (filters) => {
        return await prisma.category.findUnique({
            where: { category_id: filters.category_id },
            include: { products: true },
        });
    },
    getMany: async (filters) => {
        return await prisma.category.findMany({
            include: { products: true },
        });
    },
    create: async (data) => {
        return await prisma.category.create({
            data: { ...data },
        });
    },
};
//# sourceMappingURL=category.model.js.map