import { GetSeatFilters } from "@final/shared";
import { seatModel } from "./seat.model.js";

export const seatService = {
    get: async (filters: GetSeatFilters) => {
        return await seatModel.get(filters);
    },

    getMany: async (filters: GetSeatFilters) => {
        return await seatModel.getMany(filters);
    },
};
