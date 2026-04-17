import prisma from "@final/db"
import { ClientWithRelations } from "@final/shared"

export const clientModel = {
    /*********
    |   READ  |
     *********/
    get: async (client_id: number)=>{
        return await prisma.client.findUnique({
            where: {client_id: client_id},
        })
    },

    getMany: async (): Promise<ClientWithRelations[]> => {
        return await prisma.client.findMany({
            where: { person: { is_deleted: false } },
            include: {person: true}
        })
    },


    /***********
    |   CREATE  |
     ***********/
    create: async () => {

    }
}