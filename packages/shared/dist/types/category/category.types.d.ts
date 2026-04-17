import prisma from "@final/db";
import type { Prisma } from "@final/db";
export type CategoryWithRelations = Prisma.Result<typeof prisma.category, {
    include: {
        products: true;
    };
}, "findUnique">;
export type GetCategory = {
    category_id: number;
};
export type GetManyCategory = {};
export interface CreateCategory {
    name: string;
    description?: string;
}
//# sourceMappingURL=category.types.d.ts.map