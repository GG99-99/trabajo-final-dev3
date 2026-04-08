import prisma from "#prisma"

export const clientModel = {
    /*********
    |   READ  |
     *********/
    get: async (client_id: number)=>{
        return await prisma.client.findUnique({
            where: {client_id: client_id},
        })
    },

    getAll: async () => {
        return await prisma.client.findMany({
            include: {person: true}
        })
    },


    /***********
    |   CREATE  |
     ***********/
    create: async () => {

    }
}