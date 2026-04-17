import { productModel } from "./product.model.js";
export const productService = {
    get: async (filters) => {
        return await productModel.get(filters);
    },
    getMany: async (filters) => {
        return await productModel.getMany(filters);
    },
    create: async (data) => {
        return await productModel.create(data);
    },
};
//# sourceMappingURL=product.service.js.map