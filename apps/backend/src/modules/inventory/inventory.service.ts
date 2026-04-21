import prisma, { Prisma } from "@final/db";
import { inventoryModel } from "./inventory.model.js"
import { GetInventoryFilters, GetQuantityInventoryFilters, UpdateQuantity, CreateInventoryItem, GetNotExpired } from "@final/shared";
import { stockMovementService } from "../stockMovement/stockMovement.service.js";

export const inventoryService = {
    /*********
    |   READ  |
     *********/
    get: async (filters: GetInventoryFilters, tx?: Prisma.TransactionClient) => { 
        return await inventoryModel.get(filters, tx)
    },
    getTotalQuantity: async (filters: GetQuantityInventoryFilters) => {
        return await inventoryModel.getTotalQuantity(filters)
    },
    getNotExpired: async (filters: GetNotExpired, tx?: Prisma.TransactionClient) => { 
        return await inventoryModel.getNotExpired(filters, tx)
    },
    getManyNotExpired: async (filters: GetNotExpired) => { 
        return await inventoryModel.getManyNotExpired(filters)
    },

    /***********
    |   UPDATE  |
     ***********/
    updateQuantity: async (data: UpdateQuantity, tx: Prisma.TransactionClient) => {
        return await inventoryModel.updateQuantity(data, tx)
    },

    updateQuantityDirect: async (data: UpdateQuantity) => {
        return await prisma.$transaction(async (tx) => {
            return await inventoryModel.updateQuantity(data, tx)
        })
    },

    /***********
    |   CREATE  |
     ***********/
    create: async (data: CreateInventoryItem) => { 
        return await prisma.$transaction(async (tx) => {
            const inventoryItem = await inventoryModel.create(data, tx)

            
            await stockMovementService.create({
                inventory_item_id: inventoryItem.inventory_item_id,
                quantity: data.current_quantity,
                reason: "Entrada",
                type: "entry"
            }, tx)

            return inventoryItem
        })
    }
    
}