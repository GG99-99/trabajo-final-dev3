import { categoryModel } from "./category.model.js";
import { CreateCategory, GetManyCategory, GetCategory } from "@final/shared";

export const categoryService = {
  get: async (filters: GetCategory) => {
    return await categoryModel.get(filters);
  },

  getMany: async (filters: GetManyCategory) => {
    return await categoryModel.getMany(filters);
  },

  create: async (data: CreateCategory) => {
    return await categoryModel.create(data);
  },
};
