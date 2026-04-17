import { CreateProduct, GetManyProduct, GetProduct, ProductWithRelations } from "@final/shared";
export declare const productModel: {
    get: (filters: GetProduct) => Promise<ProductWithRelations | null>;
    getMany: (filters: GetManyProduct) => Promise<ProductWithRelations[]>;
    create: (data: CreateProduct) => Promise<{
        name: string;
        product_id: number;
        category_id: number;
        provider_id: number;
        brand: string;
    }>;
};
//# sourceMappingURL=product.model.d.ts.map