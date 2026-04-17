import prisma from "@final/db";
export const cashierModel = {
    /*********
    |   READ  |
     *********/
    get: async (cashier_id) => {
        return await prisma.cashier.findUnique({
            where: { cashier_id: cashier_id },
            include: { person: true }
        });
    },
    getMany: async () => {
        return await prisma.cashier.findMany({
            include: {
                person: true
            }
        });
    },
    /***********
    |   CREATE  |
     ***********/
    create: async () => {
    }
};
//# sourceMappingURL=cashier.model.js.map