import prisma from "#prisma"

export const cashierModel = {
    /*********
    |   READ  |
     *********/
    get: async (cashier_id: number)=>{
        return await prisma.cashier.findUnique({
            where: {cashier_id: cashier_id},
            include: {person: true}
        })
    },

    getAll: async () => {
        return await prisma.cashier.findMany({
            include: {person: true}
        })
    },


    /***********
    |   CREATE  |
     ***********/
    create: async () => {

    }
}
