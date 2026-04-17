import { GetStockMovementFilters, CreateStockMovement, ApiErr, CreateStockMovementFromProduct } from "@final/shared";
import { stockMovementModel } from "./stockMovement.model.js";
import { inventoryModel } from "../inventory/inventory.model.js";
import { inventoryService } from "../inventory/inventory.service.js";
import prisma, { Prisma } from "@final/db";


export const sotckMovementService = {
    get: async (filters: GetStockMovementFilters) => {
        return await stockMovementModel.get(filters)
    },


    /***********
    |   CREATE  |
     ***********/
    create: async (data: CreateStockMovement, tx: Prisma.TransactionClient) => {
        // validar si puedo reducir
        if(data.type !== "entry"){
            const item = await inventoryModel.get({  
                // es por id la busqueda pero le paso un gte para validar indirectamente que tiene la cantidad necesaria
                inventory_item_id: data.inventory_item_id,
                gte: data.quantity
            })

            if(!item) throw({name: "InsufficientQuantity", statusCode: 400, message: "no hay cantidad suficiente para realizar extraccion del inventario"} as ApiErr)
        }

        
        const stockMovement = await stockMovementModel.create(data, tx)

        // actualizar el quantity en el inventory item
        await inventoryService.updateQuantity({
            inventory_item_id: data.inventory_item_id,
            quantity: data.quantity,
            type: data.type,
        }, tx)

        return stockMovement


    },

    createForProductVariant: async (data: CreateStockMovementFromProduct, tx: Prisma.TransactionClient) => {
        // obtener inventory_item
        const item = await inventoryService.getNotExpired({
            product_variant_id: data.product_variant_id,
        })
        if(!item) throw({} as ApiErr)

        return await sotckMovementService.create({
            inventory_item_id: item.inventory_item_id,
            reason: data.reason,
            quantity: data.quantity,
            type: data.type,
        }, tx)

    },

    createForTatto: async () => {

    }

}