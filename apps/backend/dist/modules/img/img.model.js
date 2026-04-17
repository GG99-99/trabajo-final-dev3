import { toEndOfDay, toStartOfDay } from "#backend/utils";
import prisma from "@final/db";
export const imgModel = {
    /*********
    |   READ  |
     *********/
    get: async (filters) => {
        return await prisma.img.findUnique({
            where: {
                img_id: filters.img_id
            },
            include: {
                tattoos: true,
            },
        });
    },
    getMany: async (filters) => {
        return await prisma.img.findMany({
            where: {
                ...(filters.date && {
                    create_at: {
                        gte: toStartOfDay(filters.date),
                        lte: toEndOfDay(filters.date)
                    }
                }),
                ...(filters.active && { active: filters.active }),
            },
            include: {
                tattoos: true,
            },
        });
    },
    /***********
    |   CREATE  |
     ***********/
    create: async (data, tx) => {
        return await tx.img.create({
            data: {
                source: data.source,
                description: data.description,
            }
        });
    },
};
//# sourceMappingURL=img.model.js.map