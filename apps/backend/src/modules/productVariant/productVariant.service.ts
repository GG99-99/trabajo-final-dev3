import { productVariantModel } from "./productVariant.model.js";
import { CreateProductVariant, GetManyProductVariant, GetProductVariant } from "@final/shared";

export const productVariantService = {
  get: async (filters: GetProductVariant) => {
    return await productVariantModel.get(filters);
  },

  getMany: async (filters: GetManyProductVariant) => {
    return await productVariantModel.getMany(filters);
  },

  create: async (data: CreateProductVariant) => {
    return await productVariantModel.create(data);
  },
};
