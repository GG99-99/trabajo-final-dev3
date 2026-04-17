import { providerModel } from "./provider.model.js";
export const providerService = {
    /*********
    |   READ  |
     *********/
    get: async (filters) => {
        return await providerModel.get(filters);
    },
    getMany: async () => {
        return await providerModel.getMany();
    },
    /***********
    |   CREATE  |
     ***********/
    create: async (data) => {
        return await providerModel.create(data);
    }
};
//# sourceMappingURL=provider.service.js.map