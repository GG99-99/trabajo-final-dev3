import type { Prisma } from "@final/db";
import prisma from "@final/db";

export type ProviderWithRelations = Prisma.Result<
    typeof prisma.provider,
    {
        include: {
            products: true;
        };
    },
    'findUnique'
>;



/*****************
|   READ METHODS  |
 *****************/
export type GetProvider = {
    provider_id: number;
}


/*******************
|   CREATE METHODS  |
 *******************/
export interface CreateProvider  {
    name: string;
    code: string;
    phone_number: string;
    address: string;
}
