import prisma from "@final/db";
export const seatModel = {
    get: async (filters) => {
        if (!filters.seat_id)
            return null;
        return await prisma.seat.findUnique({
            where: { seat_id: filters.seat_id },
            include: { schedules: true },
        });
    },
    getMany: async (filters) => {
        return await prisma.seat.findMany({
            where: {
                ...(filters.seat_id && { seat_id: filters.seat_id }),
                ...(filters.seat_code && { seat_code: { contains: filters.seat_code } }),
                ...(typeof filters.is_deleted === "boolean" && { is_deleted: filters.is_deleted }),
            },
            include: { schedules: true },
        });
    },
    /***********
    |   CREATE  |
     ***********/
    create: async (data) => {
        return await prisma.seat.create({
            data: { ...data }
        });
    }
};
//# sourceMappingURL=seat.model.js.map