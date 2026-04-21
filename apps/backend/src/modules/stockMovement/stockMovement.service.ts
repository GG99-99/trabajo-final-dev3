import { GetStockMovementFilters, CreateStockMovement, ApiErr, CreateStockMovementFromProduct } from "@final/shared";
import { stockMovementModel } from "./stockMovement.model.js";
import { inventoryModel } from "../inventory/inventory.model.js";
import { inventoryService } from "../inventory/inventory.service.js";
import  { Prisma } from "@final/db";


export const stockMovementService = {
    get: async (filters: GetStockMovementFilters, tx?: Prisma.TransactionClient) => {
        return await stockMovementModel.get(filters, tx)
    },

    getCost: async (stock_movement_id: number, tx?: Prisma.TransactionClient) => {
        const st = await stockMovementModel.get({stock_movement_id}, tx)
        return Number(st?.quantity) * Number(st?.inventoryItem.productVariant.price)
    },


    /***********
    |   CREATE  |
     ***********/
    create: async (data: CreateStockMovement, tx: Prisma.TransactionClient) => {
        // validar si puedo reducir
        if(data.type !== "entry"){
            const item = await inventoryModel.get({  
                inventory_item_id: data.inventory_item_id,
                gte: data.quantity
            }, tx)

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
        // obtener inventory_item no expirado con stock suficiente (usando tx para evitar deadlock)
        const item = await inventoryService.getNotExpired({
            product_variant_id: data.product_variant_id,
        }, tx)
        if (!item) throw({
            name: 'InsufficientQuantity',
            statusCode: 400,
            message: `Sin stock disponible para product_variant_id=${data.product_variant_id}. Verifique el inventario.`
        } as ApiErr)

        // validar que la cantidad disponible alcanza
        if (Number(item.current_quantity) < data.quantity) throw({
            name: 'InsufficientQuantity',
            statusCode: 400,
            message: `Stock insuficiente para product_variant_id=${data.product_variant_id}. Disponible: ${item.current_quantity}, solicitado: ${data.quantity}.`
        } as ApiErr)

        return await stockMovementService.create({
            inventory_item_id: item.inventory_item_id,
            reason: data.reason,
            quantity: data.quantity,
            type: data.type,
        }, tx)

    },

    createForTatto: async () => {

    }

}