import { productVariantModel } from "./productVariant.model.js";
export const productVariantService = {
    get: async (filters) => {
        return await productVariantModel.get(filters);
    },
    getMany: async (filters) => {
        return await productVariantModel.getMany(filters);
    },
    create: async (data) => {
        return await productVariantModel.create(data);
    },
};
//# sourceMappingURL=productVariant.service.js.map