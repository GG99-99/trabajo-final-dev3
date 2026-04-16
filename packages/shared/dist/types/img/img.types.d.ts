import type { Prisma } from "@final/db";
import prisma from "@final/db";
export interface GetImg {
    img_id: number;
    description?: string;
}
export interface GetManyImg {
    date?: Date;
    active?: boolean;
}
/*******************
|   CREATE METHODS  |
 *******************/
export interface CreateImg {
    source: Uint8Array | Buffer;
    description?: string;
}
export type ImgWithRelations = Prisma.Result<typeof prisma.img, {
    include: {
        tattoos: true;
    };
}, 'findUnique'>;
//# sourceMappingURL=img.types.d.ts.map