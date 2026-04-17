import { imgModel } from "./img.model.js";
export const imgService = {
    /*********
    |   READ  |
     *********/
    get: async (filters) => {
        return await imgModel.get(filters);
    },
    getMany: async (filters) => {
        return await imgModel.getMany(filters);
    },
    /***********
    |   CREATE  |
     ***********/
    create: async (data, tx) => {
        return await imgModel.create(data, tx);
    },
};
//# sourceMappingURL=img.service.js.map