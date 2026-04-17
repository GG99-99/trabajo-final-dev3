import { stockMovementModel } from "./stockMovement.model.js";
export const sotckMovementService = {
    get: async (filters) => {
        return await stockMovementModel.get(filters);
    }
};
//# sourceMappingURL=stockMovement.service.js.map