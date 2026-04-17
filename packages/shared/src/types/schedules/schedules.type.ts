export type ScheduleDayOfWeek = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";

/************
|   OBJECTS  |
 ************/
export type ScheduleJsonDay = {
    start: string;
    end: string;
    active: boolean;
    breaks: {start: string, end: string}[]
}


/*****************
|   READ METHODS  |
 *****************/
export type GetManySchedules = {
    worker_id?: number;
    seat_id?: number;
    active?: boolean; 
}


/*******************
|   CREATE METHODS  |
 *******************/

export type CreateSchedule = {
    worker_id: number;
    seat_id: number;
    monday: ScheduleJsonDay;
    tuesday: ScheduleJsonDay;
    wednesday: ScheduleJsonDay;
    thursday: ScheduleJsonDay;
    friday: ScheduleJsonDay;
    saturday: ScheduleJsonDay;
    sunday: ScheduleJsonDay;
    
}

