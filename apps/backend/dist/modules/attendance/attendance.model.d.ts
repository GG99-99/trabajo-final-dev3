import { CreateAttendance, GetAttendanceFilters, AttendanceWithRelations } from "@final/shared";
export declare const attendanceModel: {
    create: (data: CreateAttendance) => Promise<AttendanceWithRelations>;
    get: (filters: GetAttendanceFilters) => Promise<AttendanceWithRelations | null>;
    getMany: (filters: GetAttendanceFilters) => Promise<AttendanceWithRelations[]>;
};
//# sourceMappingURL=attendance.model.d.ts.map