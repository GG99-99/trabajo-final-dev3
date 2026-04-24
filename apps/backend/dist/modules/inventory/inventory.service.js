import prisma from "@final/db";
import { inventoryModel } from "./inventory.model.js";
import { stockMovementService } from "../stockMovement/stockMovement.service.js";
export const inventoryService = {
    /*********
    |   READ  |
     *********/
    get: async (filters, tx) => {
        return await inventoryModel.get(filters, tx);
    },
    getTotalQuantity: async (filters) => {
        return await inventoryModel.getTotalQuantity(filters);
    },
    getNotExpired: async (filters, tx) => {
        return await inventoryModel.getNotExpired(filters, tx);
    },
    getManyNotExpired: async (filters) => {
        return await inventoryModel.getManyNotExpired(filters);
    },
    /***********
    |   UPDATE  |
     ***********/
    updateQuantity: async (data, tx) => {
        return await inventoryModel.updateQuantity(data, tx);
    },
    updateQuantityDirect: async (data) => {
        return await prisma.$transaction(async (tx) => {
            return await inventoryModel.updateQuantity(data, tx);
        });
    },
    /***********
    |   CREATE  |
     ***********/
    create: async (data) => {
        return await prisma.$transaction(async (tx) => {
            const inventoryItem = await inventoryModel.create(data, tx);
            await stockMovementService.create({
                inventory_item_id: inventoryItem.inventory_item_id,
                quantity: data.current_quantity,
                reason: "Entrada",
                type: "entry"
            }, tx);
            return inventoryItem;
        });
    }
};
//# sourceMappingURL=inventory.service.js.map