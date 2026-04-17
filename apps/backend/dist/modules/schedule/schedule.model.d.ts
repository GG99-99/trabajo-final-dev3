import { CreateSchedule, ScheduleDayOfWeek } from "@final/shared";
import { GetManySchedules } from "@final/shared";
export declare const scheduleModel: {
    /***********
    |   CREATE  |
     ***********/
    create: (data: CreateSchedule) => Promise<{
        worker_id: number;
        monday: import("@prisma/client/runtime/client").JsonValue;
        tuesday: import("@prisma/client/runtime/client").JsonValue;
        wednesday: import("@prisma/client/runtime/client").JsonValue;
        thursday: import("@prisma/client/runtime/client").JsonValue;
        friday: import("@prisma/client/runtime/client").JsonValue;
        saturday: import("@prisma/client/runtime/client").JsonValue;
        sunday: import("@prisma/client/runtime/client").JsonValue;
        created_at: Date;
        valid_until: Date | null;
        active: boolean;
        schedule_id: number;
        seat_id: number;
    }>;
    /*********
    |   READ  |
     *********/
    getActive: (worker_id: number) => Promise<{
        worker_id: number;
        monday: import("@prisma/client/runtime/client").JsonValue;
        tuesday: import("@prisma/client/runtime/client").JsonValue;
        wednesday: import("@prisma/client/runtime/client").JsonValue;
        thursday: import("@prisma/client/runtime/client").JsonValue;
        friday: import("@prisma/client/runtime/client").JsonValue;
        saturday: import("@prisma/client/runtime/client").JsonValue;
        sunday: import("@prisma/client/runtime/client").JsonValue;
        created_at: Date;
        valid_until: Date | null;
        active: boolean;
        schedule_id: number;
        seat_id: number;
    } | null>;
    getMany: (data: GetManySchedules) => Promise<{
        worker_id: number;
        monday: import("@prisma/client/runtime/client").JsonValue;
        tuesday: import("@prisma/client/runtime/client").JsonValue;
        wednesday: import("@prisma/client/runtime/client").JsonValue;
        thursday: import("@prisma/client/runtime/client").JsonValue;
        friday: import("@prisma/client/runtime/client").JsonValue;
        saturday: import("@prisma/client/runtime/client").JsonValue;
        sunday: import("@prisma/client/runtime/client").JsonValue;
        created_at: Date;
        valid_until: Date | null;
        active: boolean;
        schedule_id: number;
        seat_id: number;
    }[]>;
    getDayByWorker: (worker_id: number, day: ScheduleDayOfWeek) => Promise<{
        is_deleted: boolean;
        created_at: Date;
        schedule_id: number;
        exceptions_id: number;
        scheduled: import("@prisma/client/runtime/client").JsonValue | null;
    }[] | null>;
    /***********
    |   UPDATE  |
     ***********/
    inactive: (schedule_id: number) => Promise<{
        worker_id: number;
        monday: import("@prisma/client/runtime/client").JsonValue;
        tuesday: import("@prisma/client/runtime/client").JsonValue;
        wednesday: import("@prisma/client/runtime/client").JsonValue;
        thursday: import("@prisma/client/runtime/client").JsonValue;
        friday: import("@prisma/client/runtime/client").JsonValue;
        saturday: import("@prisma/client/runtime/client").JsonValue;
        sunday: import("@prisma/client/runtime/client").JsonValue;
        created_at: Date;
        valid_until: Date | null;
        active: boolean;
        schedule_id: number;
        seat_id: number;
    }>;
};
//# sourceMappingURL=schedule.model.d.ts.map