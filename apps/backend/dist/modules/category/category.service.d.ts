import { CreateCategory, GetManyCategory, GetCategory } from "@final/shared";
export declare const categoryService: {
    get: (filters: GetCategory) => Promise<({
        products: {
            name: string;
            product_id: number;
            category_id: number;
            provider_id: number;
            brand: string;
        }[];
    } & {
        name: string;
        category_id: number;
        description: string | null;
    }) | null>;
    getMany: (filters: GetManyCategory) => Promise<(({
        products: {
            name: string;
            product_id: number;
            category_id: number;
            provider_id: number;
            brand: string;
        }[];
    } & {
        name: string;
        category_id: number;
        description: string | null;
    }) | null)[]>;
    create: (data: CreateCategory) => Promise<{
        name: string;
        category_id: number;
        description: string | null;
    }>;
};
//# sourceMappingURL=category.service.d.ts.map