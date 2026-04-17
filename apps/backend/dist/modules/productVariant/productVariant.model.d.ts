import { CreateProductVariant, GetManyProductVariant, GetProductVariant, ProductVariantWithRelations } from "@final/shared";
export declare const productVariantModel: {
    get: (filters: GetProductVariant) => Promise<ProductVariantWithRelations | null>;
    getMany: (filters: GetManyProductVariant) => Promise<ProductVariantWithRelations[]>;
    create: (data: CreateProductVariant) => Promise<{
        product_variant_id: number;
        product_id: number;
        presentation: string;
        min_stock_level: number;
        price: import("@prisma/client/runtime/client").Decimal;
        unit: string;
    }>;
};
//# sourceMappingURL=productVariant.model.d.ts.map