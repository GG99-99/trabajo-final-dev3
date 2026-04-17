import { assistModel } from "./assist.model.js";
export const assistService = {
    create: async (data) => {
        return await assistModel.create(data);
    },
    get: async (filters) => {
        return await assistModel.get(filters);
    },
    getMany: async (filters) => {
        return await assistModel.getMany(filters);
    },
};
//# sourceMappingURL=assist.service.js.map