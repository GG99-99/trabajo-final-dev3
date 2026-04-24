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
        description: string | null;
        category_id: number;
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
        description: string | null;
        category_id: number;
    }) | null)[]>;
    create: (data: CreateCategory) => Promise<{
        name: string;
        description: string | null;
        category_id: number;
    }>;
};
//# sourceMappingURL=category.service.d.ts.map