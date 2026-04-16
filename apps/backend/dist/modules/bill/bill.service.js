import { billModel } from "./bill.model.js";
export const billService = {
    getMany: async (filters) => {
        return await billModel.getMany(filters);
    },
    get: async (filters) => {
        return await billModel.get(filters);
    }
};
//# sourceMappingURL=bill.service.js.map