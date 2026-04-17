import prisma from "@final/db";
export const providerModel = {
    /*********
    |   READ  |
     *********/
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
    },
    /***********
    |   CREATE  |
     ***********/
    create: async (data) => {
        return await prisma.provider.create({
            data: { ...data }
        });
    }
};
//# sourceMappingURL=provider.model.js.map