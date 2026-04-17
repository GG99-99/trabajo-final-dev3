import { attendanceModel } from "./attendance.model.js";
export const attendanceService = {
    create: async (data) => {
        return await attendanceModel.create(data);
    },
    get: async (filters) => {
        return await attendanceModel.get(filters);
    },
    getMany: async (filters) => {
        return await attendanceModel.getMany(filters);
    },
};
//# sourceMappingURL=attendance.service.js.map