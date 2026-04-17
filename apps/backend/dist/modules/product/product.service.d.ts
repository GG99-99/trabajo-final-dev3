import { CreateProduct, GetManyProduct, GetProduct } from "@final/shared";
export declare const productService: {
    get: (filters: GetProduct) => Promise<({
        variants: {
            product_variant_id: number;
            product_id: number;
            presentation: string;
            min_stock_level: number;
            price: import("@prisma/client/runtime/client").Decimal;
            unit: string;
        }[];
    } & {
        name: string;
        product_id: number;
        category_id: number;
        provider_id: number;
        brand: string;
    }) | null>;
    getMany: (filters: GetManyProduct) => Promise<(({
        variants: {
            product_variant_id: number;
            product_id: number;
            presentation: string;
            min_stock_level: number;
            price: import("@prisma/client/runtime/client").Decimal;
            unit: string;
        }[];
    } & {
        name: string;
        product_id: number;
        category_id: number;
        provider_id: number;
        brand: string;
    }) | null)[]>;
    create: (data: CreateProduct) => Promise<{
        name: string;
        product_id: number;
        category_id: number;
        provider_id: number;
        brand: string;
    }>;
};
//# sourceMappingURL=product.service.d.ts.map