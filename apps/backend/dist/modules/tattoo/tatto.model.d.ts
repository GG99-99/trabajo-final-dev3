import { Prisma } from "@final/db";
import { GetTattoo, GetTattooMaterials, CreateTattooMaterial, CreateTattoo } from "@final/shared";
export declare const tattooModel: {
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
    getMaterials: (data: GetTattooMaterials) => Promise<{
        tattoo_id: number;
        product_variant_id: number;
        quantity: number;
    }[]>;
    /***********
    |   CREATE  |
     ***********/
    create: (data: CreateTattoo, tx: Prisma.TransactionClient) => Promise<{
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
//# sourceMappingURL=tatto.model.d.ts.map