import type { Prisma } from "@final/db";
import { CreateTattooRequest, GetTattoo, GetTattooMaterials, CreateTattooMaterial } from "@final/shared";
export declare const tattooService: {
    /*********
    |   READ  |
     *********/
    get: (data: GetTattoo) => Promise<{
        name: string;
        tattoo_id: number;
        img_id: number;
        cost: Prisma.Decimal;
        time: string;
    } | null>;
    getMany: () => Promise<({
        img: {
            img_id: number;
            description: string | null;
            s3_key: string | null;
            s3_url: string | null;
        };
    } & {
        name: string;
        tattoo_id: number;
        img_id: number;
        cost: Prisma.Decimal;
        time: string;
    })[]>;
    getMaterials: ({ tattoo_id }: GetTattooMaterials) => Promise<{
        tattoo_id: number;
        product_variant_id: number;
        quantity: number;
    }[]>;
    /***********
    |   CREATE  |
     ***********/
    create: (data: CreateTattooRequest) => Promise<{
        name: string;
        tattoo_id: number;
        img_id: number;
        cost: Prisma.Decimal;
        time: string;
    }>;
    createMaterial: (data: CreateTattooMaterial, tx: Prisma.TransactionClient) => Promise<{
        tattoo_id: number;
        product_variant_id: number;
        quantity: number;
    }>;
};
//# sourceMappingURL=tattoo.service.d.ts.map