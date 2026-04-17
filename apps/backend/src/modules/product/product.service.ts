import { productModel } from "./product.model.js";
import { CreateProduct, GetManyProduct, GetProduct } from "@final/shared";

export const productService = {
  get: async (filters: GetProduct) => {
    return await productModel.get(filters);
  },

  getMany: async (filters: GetManyProduct) => {
    return await productModel.getMany(filters);
  },

  create: async (data: CreateProduct) => {
    return await productModel.create(data);
  },
};
