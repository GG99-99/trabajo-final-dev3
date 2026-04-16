import prisma from "@final/db";
export const imgModel = {
    create: async (data) => {
        return (await prisma.img.create({
            data: {
                source: data.source,
                description: data.description,
            },
            include: {
                tattoos: true,
            },
        }));
    },
    get: async (filters) => {
        if (!filters.img_id)
            return null;
        return await prisma.img.findUnique({
            where: { img_id: filters.img_id },
            include: {
                tattoos: true,
            },
        });
    },
    getMany: async (filters) => {
        return await prisma.img.findMany({
            where: {
                ...(filters.img_id && { img_id: filters.img_id }),
                ...(filters.description && { description: { contains: filters.description } }),
            },
            include: {
                tattoos: true,
            },
        });
    },
};
//# sourceMappingURL=img.model.js.map