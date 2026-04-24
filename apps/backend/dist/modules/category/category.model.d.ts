import { CreateCategory, GetManyCategory, GetCategory, CategoryWithRelations } from "@final/shared";
export declare const categoryModel: {
    get: (filters: GetCategory) => Promise<CategoryWithRelations | null>;
    getMany: (filters: GetManyCategory) => Promise<CategoryWithRelations[]>;
    create: (data: CreateCategory) => Promise<{
        name: string;
        description: string | null;
        category_id: number;
    }>;
};
//# sourceMappingURL=category.model.d.ts.map