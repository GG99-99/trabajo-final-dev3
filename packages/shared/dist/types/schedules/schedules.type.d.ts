export type ScheduleDayOfWeek = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
export type ScheduleJsonDay = {
    start: string;
    end: string;
    active: boolean;
    breaks: {
        start: string;
        end: string;
    }[];
};
export type ScheduleCreate = {
    worker_id: number;
    seat_id: number;
    monday: ScheduleJsonDay;
    tuesday: ScheduleJsonDay;
    wednesday: ScheduleJsonDay;
    thursday: ScheduleJsonDay;
    friday: ScheduleJsonDay;
    saturday: ScheduleJsonDay;
    sunday: ScheduleJsonDay;
};
//# sourceMappingURL=schedules.type.d.ts.map