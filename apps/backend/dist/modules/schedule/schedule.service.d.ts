import { ScheduleDayOfWeek } from "@final/shared";
import { GetManySchedules } from "@final/shared";
export declare const scheduleService: {
    /*********
    |   READ  |
     *********/
    getActive: (worker_id: number) => Promise<{
        worker_id: number;
        monday: import("@prisma/runtime/client.js").JsonValue;
        tuesday: import("@prisma/runtime/client.js").JsonValue;
        wednesday: import("@prisma/runtime/client.js").JsonValue;
        thursday: import("@prisma/runtime/client.js").JsonValue;
        friday: import("@prisma/runtime/client.js").JsonValue;
        saturday: import("@prisma/runtime/client.js").JsonValue;
        sunday: import("@prisma/runtime/client.js").JsonValue;
        created_at: Date;
        valid_until: Date | null;
        active: boolean;
        schedule_id: number;
        seat_id: number;
    } | null>;
    getMany: (data: GetManySchedules) => Promise<{
        worker_id: number;
        monday: import("@prisma/runtime/client.js").JsonValue;
        tuesday: import("@prisma/runtime/client.js").JsonValue;
        wednesday: import("@prisma/runtime/client.js").JsonValue;
        thursday: import("@prisma/runtime/client.js").JsonValue;
        friday: import("@prisma/runtime/client.js").JsonValue;
        saturday: import("@prisma/runtime/client.js").JsonValue;
        sunday: import("@prisma/runtime/client.js").JsonValue;
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
        scheduled: import("@prisma/runtime/client.js").JsonValue | null;
    }[] | null>;
};
//# sourceMappingURL=schedule.service.d.ts.map