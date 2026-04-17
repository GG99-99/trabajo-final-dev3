import prisma from "@final/db";
export const tattooModel = {
    get: async (data) => {
        return await prisma.tattoo.findUnique({
            where: { ...data }
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