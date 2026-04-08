import { ScheduleDayOfWeek } from "@final/shared";
import { GetSchedulesFilters } from "./schedule.interface.js";
import { scheduleModel } from "./schedule.model.js";


export const scheduleService = {

    /*********
    |   READ  |
     *********/
    getMany: async (data: GetSchedulesFilters) => await scheduleModel.getMany(data),

    getDayByWorker: async (worker_id: number, day: ScheduleDayOfWeek ) => 
        {return await scheduleModel.getDayByWorker(worker_id, day)},

    
}