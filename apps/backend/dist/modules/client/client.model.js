import prisma from "@final/db";
export const clientModel = {
    /*********
    |   READ  |
     *********/
    get: async (client_id) => {
        return await prisma.client.findUnique({
            where: { client_id: client_id },
        });
    },
    getMany: async () => {
        return await prisma.client.findMany({
            where: { person: { is_deleted: false } },
            include: { person: true }
        });
    },
    getByEmail: async (email) => {
        return await prisma.client.findFirst({
            where: {
                person: {
                    email: email,
                    is_deleted: false,
                }
            },
            include: { person: true }
        });
    },
    /***********
    |   CREATE  |
     ***********/
    create: async () => {
    }
};
//# sourceMappingURL=client.model.js.map