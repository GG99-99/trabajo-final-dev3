import { scheduleModel } from "./schedule.model.js";
export const scheduleService = {
    /*********
    |   READ  |
     *********/
    getActive: async (worker_id) => {
        return await scheduleModel.getActive(worker_id);
    },
    getMany: async (filters) => await scheduleModel.getMany(filters),
    getDayByWorker: async (worker_id, day) => { return await scheduleModel.getDayByWorker(worker_id, day); },
    /***********
    |   CREATE  |
     ***********/
    create: async (data) => {
        // inactivar todos schedules activos
        const activeSchedules = await scheduleService.getMany({
            worker_id: data.worker_id,
            active: true
        });
        // desactivar los schedules
        for (const sch of activeSchedules) {
            await scheduleService.inactive(sch.schedule_id);
        }
        return await scheduleModel.create(data);
    },
    /***********
    |   UPDATE  |
     ***********/
    inactive: async (schedule_id) => {
        return await scheduleModel.inactive(schedule_id);
    }
};
//# sourceMappingURL=schedule.service.js.map