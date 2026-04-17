import { inventoryModel } from "./inventory.model.js";
export const inventoryService = {
    /*********
    |   READ  |
     *********/
    get: async (filters) => {
        return await inventoryModel.get(filters);
    },
    getQuantity: async (filters) => {
        return await inventoryModel.getQuantity(filters);
    },
    getExpired: async (filters) => {
        return await inventoryModel.getExpired(filters);
    },
    /***********
    |   CREATE  |
     ***********/
};
//# sourceMappingURL=inventory.service.js.map