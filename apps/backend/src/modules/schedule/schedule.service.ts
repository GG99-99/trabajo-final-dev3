import { CreateSchedule, ScheduleDayOfWeek } from "@final/shared";
import { GetManySchedules } from "@final/shared";
import { scheduleModel } from "./schedule.model.js";


export const scheduleService = {

    /*********
    |   READ  |
     *********/
    getActive: async (worker_id: number) => {
        return await scheduleModel.getActive(worker_id)
    },
    getMany: async (filters: GetManySchedules) => await scheduleModel.getMany(filters),

    getDayByWorker: async (worker_id: number, day: ScheduleDayOfWeek ) => 
        {return await scheduleModel.getDayByWorker(worker_id, day)},

    /***********
    |   CREATE  |
     ***********/
    create: async (data: CreateSchedule) => {
        // inactivar todos schedules activos
        const activeSchedules = await scheduleService.getMany({
            worker_id: data.worker_id,
            active: true
        })

        // desactivar los schedules
        for(const sch of activeSchedules) {
            await scheduleService.inactive(sch.schedule_id)
        }

        return await scheduleModel.create(data)
    },

    /***********
    |   UPDATE  |
     ***********/
    inactive: async (schedule_id: number) => {
        return await scheduleModel.inactive(schedule_id)
    }
    
}