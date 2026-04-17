import type { Schedule } from '@final/db';
import prisma from "@final/db"
import { CreateSchedule, ScheduleDayOfWeek } from "@final/shared";
import { GetManySchedules } from "@final/shared";




export const scheduleModel = {
    /***********
    |   CREATE  |
     ***********/
    create: async (data: CreateSchedule) => {
        return await prisma.schedule.create({
            data: {
                ...data
            }
        });
    },

    /*********
    |   READ  |
     *********/
    getActive: async (worker_id: number) => {
        return await prisma.schedule.findFirst({
            where: {
                worker_id: worker_id,
                active: true
            },
            orderBy: {
                created_at: 'desc'
            }
        })
    },
    getMany: async (data: GetManySchedules) => {
        return await prisma.schedule.findMany({
            where: {
                ...(data.worker_id  &&  {worker_id: data.worker_id}),
                ...(data.seat_id    &&  {seat_id: data.seat_id}),
                active: data.active || undefined,
            }
        })
    },
    
    getDayByWorker: async function (worker_id: number, day: ScheduleDayOfWeek ) {
        const schedule = await prisma.schedule.findFirst({
            where: { worker_id: worker_id, active: true },
            select: { [day as keyof  Schedule]: true },
        });

        return schedule?.[day] ?? null ;
    },

    /***********
    |   UPDATE  |
     ***********/
    inactive: async (schedule_id: number) => {
        return await prisma.schedule.update({
            where: {schedule_id: schedule_id},
            data: {active: false, valid_until: new Date()}

        })
    }
}


