import prisma from "@final/db";
import { CreateProvider, GetProvider, ProviderWithRelations } from "@final/shared";



export const providerModel = {
    /*********
    |   READ  |
     *********/
    get: async (filters:GetProvider): Promise<ProviderWithRelations | null> => {
        return await prisma.provider.findUnique({
            where: {provider_id: filters.provider_id},
            include: {products: true}
        })
    }
    ,
    getMany: async (): Promise<ProviderWithRelations[]> => {
        return await prisma.provider.findMany({
            include: {products: true}
        })
    },


    /***********
    |   CREATE  |
     ***********/
    create: async (data: CreateProvider) => {
        return await prisma.provider.create({
            data: {...data}
        })
    }
}