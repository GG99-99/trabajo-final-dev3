import { CreateImg, GetImg, ImgWithRelations } from "@final/shared";
export declare const imgModel: {
    create: (data: CreateImg) => Promise<ImgWithRelations>;
    get: (filters: GetImg) => Promise<ImgWithRelations | null>;
    getMany: (filters: GetImg) => Promise<ImgWithRelations[]>;
};
//# sourceMappingURL=img.model.d.ts.map