import prisma from "@final/db";
export const appointmentModel = {
    /*********
    |   READ  |
     *********/
    getMany: async (filters) => {
        return await prisma.appointment.findMany({
            where: {
                ...(filters.appointment_id && { appointment_id: filters.appointment_id }),
                ...(filters.worker_id && { worker_id: filters.worker_id }),
                ...(filters.client_id && { client_id: filters.client_id }),
                ...(filters.tattoo_id && { tattoo_id: filters.tattoo_id }),
                ...(filters.end && { end: filters.end }),
                ...(filters.start && { start: filters.start }),
                ...(filters.date && { date: new Date(filters.date) }),
                ...(filters.status && { status: filters.status })
            },
            orderBy: { start: "asc" }
        });
    },
    /***********
    |   UPDATE  |
     ***********/
    updateStatus: async (appointment_id, status, tx) => {
        return await tx.appointment.update({
            where: { appointment_id },
            data: {
                status
            }
        });
    },
    /***********
    |   CREATE  |
     ***********/
    create: async (data) => {
        return await prisma.appointment.create({
            data: {
                ...data,
                date: new Date(data.date + "T00:00:00Z")
            }
        });
    }
};
//# sourceMappingURL=appointment.model.js.map