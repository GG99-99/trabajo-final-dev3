import { scheduleModel } from "./schedule.model.js";
export const scheduleService = {
    /*********
    |   READ  |
     *********/
    getActive: async (worker_id) => {
        return await scheduleModel.getActive(worker_id);
    },
    getMany: async (data) => await scheduleModel.getMany(data),
    getDayByWorker: async (worker_id, day) => { return await scheduleModel.getDayByWorker(worker_id, day); },
};
//# sourceMappingURL=schedule.service.js.map