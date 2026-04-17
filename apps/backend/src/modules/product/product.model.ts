import prisma from "@final/db";
import { CreateProduct, GetManyProduct, GetProduct, ProductWithRelations } from "@final/shared";

export const productModel = {
  get: async (filters: GetProduct): Promise<ProductWithRelations | null> => {
    return await prisma.product.findUnique({
      where: { product_id: filters.product_id },
      include: { variants: true },
    });
  },

  getMany: async (filters: GetManyProduct): Promise<ProductWithRelations[]> => {
    const where: { provider_id?: number; category_id?: number } = {};

    if (filters.provider_id !== undefined) where.provider_id = filters.provider_id;
    if (filters.category_id !== undefined) where.category_id = filters.category_id;

    return await prisma.product.findMany({
      where: Object.keys(where).length ? where : undefined,
      include: { variants: true },
    });
  },

  create: async (data: CreateProduct) => {
    return await prisma.product.create({
      data: { ...data },
    });
  },
};
