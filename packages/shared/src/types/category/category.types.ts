import prisma from "@final/db";
import type { Prisma } from "@final/db";

export type CategoryWithRelations = Prisma.Result<
  typeof prisma.category,
  {
    include: {
      products: true;
    };
  },
  "findUnique"
>;

export type GetCategory = {
  category_id: number;
};

export type GetManyCategory = {
  // No filters needed for now, but can add if required
};

export interface CreateCategory {
  name: string;
  description?: string;
}
