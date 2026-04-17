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
    getMaterials: (data: GetTattooMaterials) => Promise<{
        tattoo_id: number;
        quantity: number;
        product_variant_id: number;
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
        quantity: number;
        product_variant_id: number;
    }>;
};
//# sourceMappingURL=tatto.model.d.ts.map