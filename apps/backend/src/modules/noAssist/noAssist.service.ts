import { NoAssistCreateData, GetNoAssistFilters } from "@final/shared";
import { noAssistModel } from "./noAssist.model.js";

export const noAssistService = {
    create: async (data: NoAssistCreateData) => {
        return await noAssistModel.create(data);
    },

    get: async (filters: GetNoAssistFilters) => {
        return await noAssistModel.get(filters);
    },

    getMany: async (filters: GetNoAssistFilters) => {
        return await noAssistModel.getMany(filters);
    },
};
