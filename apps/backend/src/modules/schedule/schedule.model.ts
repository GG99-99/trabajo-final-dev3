import { Schedule } from '@prisma/index.js';
import prisma from "#prisma"
import { ScheduleCreate, ScheduleDayOfWeek } from "@final/shared";
import { GetSchedulesFilters } from "./schedule.interface.js";




export const scheduleModel = {
    /***********
    |   CREATE  |
     ***********/
    create: async (data: ScheduleCreate) => {
        return await prisma.schedule.create({
            data: {
                worker_id: data.worker_id,
                seat_id:   data.seat_id,
                monday:    data.monday,    
                tuesday:   data.tuesday,
                wednesday: data.wednesday,
                thursday:  data.thursday,
                friday:    data.friday,
                saturday:  data.saturday,
                sunday:    data.sunday,
            }
        });
    },

    /*********
    |   READ  |
     *********/
    getMany: async (data: GetSchedulesFilters) => {
        return await prisma.schedule.findMany({
            where: {
                ...(data.worker_id  &&  {worker_id: data.worker_id}),
                ...(data.seat_id    &&  {seat_id: data.seat_id}),
                active: true
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


