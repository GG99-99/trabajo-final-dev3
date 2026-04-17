import type { Prisma } from "@final/db";
import prisma from "@final/db";


/*****************
|   READ METHODS  |
 *****************/
export type GetAttendanceFilters = {
    attendance_id?: number;
    work_date?: Date;
    status?: boolean;
    day?: string;
    is_deleted?: boolean;
}

/*******************
|   CREATE METHODS  |
 *******************/
export type CreateAttendance = {
    day: string;
    work_date: Date;
    status?: boolean;
}


/*****************
|   OBJECT TYPES  |
 *****************/
export type AttendanceWithRelations = Prisma.Result<
    typeof prisma.attendance,
    {
        include: {
            assists: true;
            noAssists: true;
        };
    },
    'findUnique'
>;