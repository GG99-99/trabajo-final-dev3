import { categoryModel } from "./category.model.js";
export const categoryService = {
    get: async (filters) => {
        return await categoryModel.get(filters);
    },
    getMany: async (filters) => {
        return await categoryModel.getMany(filters);
    },
    create: async (data) => {
        return await categoryModel.create(data);
    },
};
//# sourceMappingURL=category.service.js.map