import { toEndOfDay, toStartOfDay } from "#backend/utils";
import prisma, { Prisma } from "@final/db";
import { GetManyStockMovementFilters, GetStockMovementFilters, CreateStockMovement } from "@final/shared";


export const stockMovementModel = {
    get: async (filters: GetStockMovementFilters) =>{
        return await prisma.stockMovement.findFirst({
            where: {
                ...(filters.stock_movement_id && {stock_movement_id: filters.stock_movement_id}),
                ...(filters.inventory_item_id && {inventory_item_id: filters.inventory_item_id}),

                ...(filters.create_at && {create_at: {
                            gt: toStartOfDay(filters.create_at),
                            lt: toEndOfDay(filters.create_at)
                    }}),
                ...(filters.quantity && {quantity: filters.quantity}),
                ...(filters.type && {type: filters.type}),


            }
        })
    },
    getMany: async (filters: GetManyStockMovementFilters) => {
        return await prisma.stockMovement.findMany({
            where: {
                ...(filters.inventory_item_id && {inventory_item_id: filters.inventory_item_id}),
                ...(filters.create_at && {create_at: {
                            gt: toStartOfDay(filters.create_at),
                            lt: toEndOfDay(filters.create_at)
                    }}),
                ...(filters.quantity && {quantity: filters.quantity}),
                ...(filters.type && {type: filters.type}),
            }
        })
    },


    /***********
    |   CREATE  |
     ***********/
    create: async (data: CreateStockMovement, tx: Prisma.TransactionClient) => {
        
            // crear el stockMovement
            return await tx.stockMovement.create({
                data: {...data}
            }) 
     }
}