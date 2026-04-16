import { GetSeatFilters, SeatWithRelations } from "@final/shared";
export declare const seatModel: {
    get: (filters: GetSeatFilters) => Promise<SeatWithRelations | null>;
    getMany: (filters: GetSeatFilters) => Promise<SeatWithRelations[]>;
};
//# sourceMappingURL=seat.model.d.ts.map