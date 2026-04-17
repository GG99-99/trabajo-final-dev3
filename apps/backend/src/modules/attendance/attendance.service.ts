import { CreateAttendance, GetAttendanceFilters } from "@final/shared";
import { attendanceModel } from "./attendance.model.js";

export const attendanceService = {
    create: async (data: CreateAttendance) => {
        return await attendanceModel.create(data);
    },

    get: async (filters: GetAttendanceFilters) => {
        return await attendanceModel.get(filters);
    },

    getMany: async (filters: GetAttendanceFilters) => {
        return await attendanceModel.getMany(filters);
    },
};
