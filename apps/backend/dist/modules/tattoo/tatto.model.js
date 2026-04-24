import prisma from "@final/db";
export const tattooModel = {
    get: async (data) => {
        return await prisma.tattoo.findUnique({
            where: { ...data }
        });
    },
    getMany: async () => {
        return await prisma.tattoo.findMany({
            orderBy: { name: 'asc' },
            include: { img: { select: { img_id: true, s3_url: true, s3_key: true, description: true } } }
        });
    },
    getMaterials: async (data) => {
        return await prisma.tattooMaterial.findMany({
            where: { ...data }
        });
    },
    /***********
    |   CREATE  |
     ***********/
    create: async (data, tx) => {
        return await tx.tattoo.create({
            data: { ...data }
        });
    },
    createMaterial: async (data, tx) => {
        return await tx.tattooMaterial.create({
            data: { ...data }
        });
    }
};
//# sourceMappingURL=tatto.model.js.map