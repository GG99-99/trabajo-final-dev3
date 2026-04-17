import { Prisma } from "@final/db";
import { CreateImg, GetImg, GetManyImg, ImgWithRelations } from "@final/shared";
export declare const imgModel: {
    /*********
    |   READ  |
     *********/
    get: (filters: GetImg) => Promise<ImgWithRelations | null>;
    getMany: (filters: GetManyImg) => Promise<ImgWithRelations[]>;
    /***********
    |   CREATE  |
     ***********/
    create: (data: CreateImg, tx: Prisma.TransactionClient) => Promise<{
        create_at: Date;
        active: boolean;
        img_id: number;
        description: string | null;
        source: Prisma.Bytes;
    }>;
};
//# sourceMappingURL=img.model.d.ts.map