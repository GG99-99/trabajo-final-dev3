import { seatModel } from "./seat.model.js";
export const seatService = {
    get: async (filters) => {
        return await seatModel.get(filters);
    },
    getMany: async (filters) => {
        return await seatModel.getMany(filters);
    },
    /***********
    |   CREATE  |
     ***********/
    create: async (data) => {
        return await seatModel.create(data);
    }
};
//# sourceMappingURL=seat.service.js.map