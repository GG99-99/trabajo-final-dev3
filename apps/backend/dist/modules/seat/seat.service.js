import { seatModel } from "./seat.model.js";
export const seatService = {
    get: async (filters) => {
        return await seatModel.get(filters);
    },
    getMany: async (filters) => {
        return await seatModel.getMany(filters);
    },
};
//# sourceMappingURL=seat.service.js.map