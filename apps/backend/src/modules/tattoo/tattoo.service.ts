import type { Prisma } from "@final/db";

import { CreateTattooRequest, GetTattoo, GetTattooMaterials, CreateTattooMaterial } from "@final/shared";
import { tattooModel } from "./tatto.model.js";
import prisma from "@final/db";
import { imgService } from "../img/img.service.js";



export const tattooService = {
    /*********
    |   READ  |
     *********/
    get: async (data: GetTattoo) => {
        return await tattooModel.get(data)
    },
    getMany: async () => {
        return await tattooModel.getMany()
    },
    getMaterials: async ({tattoo_id}: GetTattooMaterials) => {
        return await tattooModel.getMaterials({tattoo_id})
    },

    /***********
    |   CREATE  |
     ***********/
    create: async (data: CreateTattooRequest) => {
        return await prisma.$transaction(async (tx) => {
            // crear img
            const img = await imgService.create({
                source: data.img.source,
                description: data.img.description
            }, tx)

            // crear tatto
            const tattoo = await tattooModel.create({
                img_id: img.img_id,
                cost: data.cost,
                time: data.time,
                name: data.name
            }, tx)
        
            // crear materials
            for(const m of data.materials){
                await tattooService.createMaterial({
                    tattoo_id: tattoo.tattoo_id,
                    quantity: m.quantity,
                    product_variant_id: m.product_variant_id
                }, tx)
            }

            return tattoo
            
        })
    },

    createMaterial: async (data: CreateTattooMaterial, tx: Prisma.TransactionClient) => {
        return await tattooModel.createMaterial(data, tx)
    }
}

