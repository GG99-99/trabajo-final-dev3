import { Prisma } from "@final/db";
import { CreateImg, GetImg, GetManyImg, ImgWithRelations } from "@final/shared";
import { imgModel } from "./img.model.js";

export const imgService = {
    /*********
    |   READ  |
     *********/
    get: async (filters: GetImg): Promise<ImgWithRelations | null> => {
        return await imgModel.get(filters)
    },
    getMany: async (filters: GetManyImg): Promise<ImgWithRelations[]> => {
        return await imgModel.getMany(filters)
    },

    /***********
    |   CREATE  |
     ***********/
    create: async (data: CreateImg, tx: Prisma.TransactionClient) => {
        return await imgModel.create(data, tx)
    },
}