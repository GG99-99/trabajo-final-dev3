import prisma from "@final/db";
export const scheduleModel = {
    /***********
    |   CREATE  |
     ***********/
    create: async (data) => {
        return await prisma.schedule.create({
            data: {
                ...data
            }
        });
    },
    /*********
    |   READ  |
     *********/
    getActive: async (worker_id) => {
        return await prisma.schedule.findFirst({
            where: {
                worker_id: worker_id,
                active: true
            }
        });
    },
    getMany: async (data) => {
        return await prisma.schedule.findMany({
            where: {
                ...(data.worker_id && { worker_id: data.worker_id }),
                ...(data.seat_id && { seat_id: data.seat_id }),
                active: data.active || undefined,
            }
        });
    },
    getDayByWorker: async function (worker_id, day) {
        const schedule = await prisma.schedule.findFirst({
            where: { worker_id: worker_id, active: true },
            select: { [day]: true },
        });
        return schedule?.[day] ?? null;
    },
    /***********
    |   UPDATE  |
     ***********/
    inactive: async (schedule_id) => {
        return await prisma.schedule.update({
            where: { schedule_id: schedule_id },
            data: { active: false, valid_until: new Date() }
        });
    }
};
//# sourceMappingURL=schedule.model.js.map