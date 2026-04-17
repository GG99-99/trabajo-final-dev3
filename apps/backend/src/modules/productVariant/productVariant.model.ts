import prisma from "@final/db";
import { CreateProductVariant, GetManyProductVariant, GetProductVariant, ProductVariantWithRelations } from "@final/shared";

export const productVariantModel = {
  get: async (filters: GetProductVariant): Promise<ProductVariantWithRelations | null> => {
    return await prisma.productVariant.findUnique({
      where: { product_variant_id: filters.product_variant_id },
      include: { product: true },
    });
  },

  getMany: async (filters: GetManyProductVariant): Promise<ProductVariantWithRelations[]> => {
    const where: { product_id?: number; presentation?: string } = {};

    if (filters.product_id !== undefined) where.product_id = filters.product_id;
    if (filters.presentation !== undefined) where.presentation = filters.presentation;

    return await prisma.productVariant.findMany({
      where: Object.keys(where).length ? where : undefined,
      include: { product: true },
    });
  },

  create: async (data: CreateProductVariant) => {
    return await prisma.productVariant.create({
      data: { ...data },
    });
  },
};
