import prisma from "@final/db";
import type { Prisma } from "@final/db"



export type ProductWithRelations = Prisma.Result<
    typeof prisma.productVariant,
      {
        include: {
            product: true
        };
      },
      'findUnique'
>