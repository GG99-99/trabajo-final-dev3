import prisma from "@final/db";
export const providerModel = {
    get: async (filters) => {
        return await prisma.provider.findUnique({
            where: { provider_id: filters.provider_id },
            include: { products: true }
        });
    },
    getMany: async () => {
        return await prisma.provider.findMany({
            include: { products: true }
        });
    }
};
//# sourceMappingURL=provider.model.js.map