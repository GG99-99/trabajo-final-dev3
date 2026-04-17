import { toEndOfDay, toStartOfDay } from "#backend/utils";
import prisma, { Prisma } from "@final/db";
import { CreateImg, GetImg, GetManyImg, ImgWithRelations } from "@final/shared";

export const imgModel = {
    

    /*********
    |   READ  |
     *********/
    get: async (filters: GetImg): Promise<ImgWithRelations | null> => {

        return await prisma.img.findUnique({
            where: { 
                img_id: filters.img_id 
            },
            include: {
                tattoos: true,
            },
        });
    },

    getMany: async (filters: GetManyImg): Promise<ImgWithRelations[]> => {
        return await prisma.img.findMany({
            where: {
                ...(filters.date && { 
                    create_at: {
                        gte: toStartOfDay(filters.date),
                        lte: toEndOfDay(filters.date)
                    } }),
                ...(filters.active && { active: filters.active }),
            },
            include: {
                tattoos: true,
            },
        });
    },

    /***********
    |   CREATE  |
     ***********/
    create: async (data: CreateImg, tx: Prisma.TransactionClient)  => {
        return await tx.img.create({
            data: {
                source: data.source as unknown as Uint8Array<ArrayBuffer>,
                description: data.description,
            }
        }) ;
    },
};
