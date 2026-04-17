import { CreateAttendance, GetAttendanceFilters } from "@final/shared";
export declare const attendanceService: {
    create: (data: CreateAttendance) => Promise<AttendanceWithRelations>;
    get: (filters: GetAttendanceFilters) => Promise<any>;
    getMany: (filters: GetAttendanceFilters) => Promise<AttendanceWithRelations[]>;
};
//# sourceMappingURL=attendance.service.d.ts.map