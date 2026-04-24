import { Prisma } from "@final/db";
import { CreateImg, GetImg, GetManyImg, ImgWithRelations } from "@final/shared";
export declare const imgService: {
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
        img_id: number;
        active: boolean;
        source: Prisma.Bytes | null;
        description: string | null;
        s3_key: string | null;
        s3_url: string | null;
    }>;
};
//# sourceMappingURL=img.service.d.ts.map