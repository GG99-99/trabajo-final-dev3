import prisma, {Prisma} from "@final/db";
import { AppointmentStatus } from "@final/db";
import { GetAppointmentFilters, CreateAppointment, AppointmentWithRelation } from "@final/shared";

import { toStartOfDay, toEndOfDay } from "#backend/utils";

export const appointmentModel = {

    /*********
    |   READ  |
     *********/
    getMany: async (filters: GetAppointmentFilters): Promise<AppointmentWithRelation[]> => {
        return await prisma.appointment.findMany({
            where: {
                ...(filters.appointment_id  && {appointment_id: filters.appointment_id}),
                ...(filters.worker_id       && { worker_id:     filters.worker_id }),
                ...(filters.client_id       && { client_id:     filters.client_id }),
                ...(filters.tattoo_id       && { tattoo_id:      filters.tattoo_id}),
                ...(filters.end             && { end:           filters.end}),
                ...(filters.start           && { start:         filters.start}),
                ...(filters.date && {
                        date: {
                            gte: toStartOfDay(filters.date),
                            lte: toEndOfDay(filters.date),
                        }
                    }),
                ...(filters.status          && { status:        filters.status })
            },
            orderBy: { start: "asc" },
            include: {
                worker: true,
                client: true,
                tattoo: true,
                bill: true
            }
        })
    },

    /***********
    |   UPDATE  |
     ***********/
    updateStatus: async (appointment_id: number, status: AppointmentStatus, tx: Prisma.TransactionClient) => {
        return await tx.appointment.update({
            where: { appointment_id },
            data: {
                status
            }
        })
    },

    /***********
    |   CREATE  |
     ***********/
    create: async (data: CreateAppointment) => {
        // Normalize date to noon UTC to avoid timezone day-shift issues
        const dateStr = data.date instanceof Date
            ? data.date.toISOString().slice(0, 10)
            : String(data.date).slice(0, 10)
        return await prisma.appointment.create({
            data: {
                ...data,
                date: new Date(dateStr + 'T12:00:00.000Z')
            }
        })
    }

}