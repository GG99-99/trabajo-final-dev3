import { CreateProductVariant, GetManyProductVariant, GetProductVariant } from "@final/shared";
export declare const productVariantService: {
    get: (filters: GetProductVariant) => Promise<({
        product: {
            name: string;
            product_id: number;
            category_id: number;
            provider_id: number;
            brand: string;
        };
    } & {
        product_variant_id: number;
        product_id: number;
        presentation: string;
        min_stock_level: number;
        price: import("@prisma/client/runtime/client").Decimal;
        unit: string;
    }) | null>;
    getMany: (filters: GetManyProductVariant) => Promise<(({
        product: {
            name: string;
            product_id: number;
            category_id: number;
            provider_id: number;
            brand: string;
        };
    } & {
        product_variant_id: number;
        product_id: number;
        presentation: string;
        min_stock_level: number;
        price: import("@prisma/client/runtime/client").Decimal;
        unit: string;
    }) | null)[]>;
    create: (data: CreateProductVariant) => Promise<{
        product_variant_id: number;
        product_id: number;
        presentation: string;
        min_stock_level: number;
        price: import("@prisma/client/runtime/client").Decimal;
        unit: string;
    }>;
};
//# sourceMappingURL=productVariant.service.d.ts.map