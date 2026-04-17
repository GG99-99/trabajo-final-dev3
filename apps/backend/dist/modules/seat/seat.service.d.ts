import { CreateSeat, GetSeatFilters } from "@final/shared";
export declare const seatService: {
    get: (filters: GetSeatFilters) => Promise<({
        schedules: {
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
        }[];
    } & {
        is_deleted: boolean;
        created_at: Date;
        seat_id: number;
        seat_code: string;
    }) | null>;
    getMany: (filters: GetSeatFilters) => Promise<(({
        schedules: {
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
        }[];
    } & {
        is_deleted: boolean;
        created_at: Date;
        seat_id: number;
        seat_code: string;
    }) | null)[]>;
    /***********
    |   CREATE  |
     ***********/
    create: (data: CreateSeat) => Promise<{
        is_deleted: boolean;
        created_at: Date;
        seat_id: number;
        seat_code: string;
    }>;
};
//# sourceMappingURL=seat.service.d.ts.map