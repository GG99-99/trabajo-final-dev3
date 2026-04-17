import { noAssistModel } from "./noAssist.model.js";
export const noAssistService = {
    create: async (data) => {
        return await noAssistModel.create(data);
    },
    get: async (filters) => {
        return await noAssistModel.get(filters);
    },
    getMany: async (filters) => {
        return await noAssistModel.getMany(filters);
    },
};
//# sourceMappingURL=noAssist.service.js.map