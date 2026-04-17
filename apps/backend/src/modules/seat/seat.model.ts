import prisma from "@final/db";
import { CreateSeat, GetSeatFilters, SeatWithRelations } from "@final/shared";

export const seatModel = {
    get: async (filters: GetSeatFilters): Promise<SeatWithRelations | null> => {
        if (!filters.seat_id) return null;

        return await prisma.seat.findUnique({
            where: { seat_id: filters.seat_id },
            include: { schedules: true },
        });
    },

    getMany: async (filters: GetSeatFilters): Promise<SeatWithRelations[]> => {
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
    create: async (data: CreateSeat) => {
        return await prisma.seat.create({
            data: {...data}
        })
    }
};
