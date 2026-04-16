import { CreateAssist, GetAssistFilters } from "@final/shared";
import { assistModel } from "./assist.model.js";

export const assistService = {
    create: async (data: CreateAssist) => {
        return await assistModel.create(data);
    },

    get: async (filters: GetAssistFilters) => {
        return await assistModel.get(filters);
    },

    getMany: async (filters: GetAssistFilters) => {
        return await assistModel.getMany(filters);
    },
};
