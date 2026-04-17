import { CreateSeat, GetSeatFilters, SeatWithRelations } from "@final/shared";
export declare const seatModel: {
    get: (filters: GetSeatFilters) => Promise<SeatWithRelations | null>;
    getMany: (filters: GetSeatFilters) => Promise<SeatWithRelations[]>;
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
//# sourceMappingURL=seat.model.d.ts.map