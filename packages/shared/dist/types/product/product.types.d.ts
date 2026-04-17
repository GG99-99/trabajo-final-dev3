import prisma from "@final/db";
import type { Prisma } from "@final/db";
export type ProductWithRelations = Prisma.Result<typeof prisma.product, {
    include: {
        variants: true;
    };
}, "findUnique">;
export type ProductVariantWithRelations = Prisma.Result<typeof prisma.productVariant, {
    include: {
        product: true;
    };
}, "findUnique">;
export type GetProduct = {
    product_id: number;
};
export type GetManyProduct = {
    provider_id?: number;
    category_id?: number;
};
export interface CreateProduct {
    category_id: number;
    provider_id: number;
    name: string;
    brand: string;
}
export type GetProductVariant = {
    product_variant_id: number;
};
export type GetManyProductVariant = {
    product_id?: number;
    presentation?: string;
};
export interface CreateProductVariant {
    product_id: number;
    presentation: string;
    min_stock_level: number;
    price: number;
    unit: string;
}
//# sourceMappingURL=product.types.d.ts.map