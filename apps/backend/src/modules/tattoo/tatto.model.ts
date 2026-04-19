
import prisma, {Prisma} from "@final/db";
import { GetTattoo, GetTattooMaterials, CreateTattooMaterial, CreateTattoo } from "@final/shared";



export const tattooModel = {
    get: async (data: GetTattoo) => {
        return await prisma.tattoo.findUnique({
            where: { ...data }
        })
    },

    getMany: async () => {
        return await prisma.tattoo.findMany({
            orderBy: { name: 'asc' },
            include: { img: { select: { img_id: true, s3_url: true, s3_key: true, description: true } } }
        })
    },

    getMaterials: async (data: GetTattooMaterials) => {
        return await prisma.tattooMaterial.findMany({
            where: { ...data }
        })
    },

    /***********
    |   CREATE  |
     ***********/
    create: async (data: CreateTattoo, tx: Prisma.TransactionClient) => {
        return await tx.tattoo.create({
            data: {...data}
        })
    },
    createMaterial: async (data: CreateTattooMaterial, tx: Prisma.TransactionClient) => {
        return await tx.tattooMaterial.create({
            data: {...data}
        })
    }


}