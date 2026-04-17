import prisma from "@final/db";
import { CreateCategory, GetManyCategory, GetCategory, CategoryWithRelations } from "@final/shared";

export const categoryModel = {
  get: async (filters: GetCategory): Promise<CategoryWithRelations | null> => {
    return await prisma.category.findUnique({
      where: { category_id: filters.category_id },
      include: { products: true },
    });
  },

  getMany: async (filters: GetManyCategory): Promise<CategoryWithRelations[]> => {
    return await prisma.category.findMany({
      include: { products: true },
    });
  },

  create: async (data: CreateCategory) => {
    return await prisma.category.create({
      data: { ...data },
    });
  },
};
