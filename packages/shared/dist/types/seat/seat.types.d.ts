import type { Prisma } from "@final/db";
import prisma from "@final/db";
/*****************
|   READ METHODS  |
 *****************/
export interface GetSeatFilters {
    seat_id?: number;
    seat_code?: string;
    is_deleted?: boolean;
}
export type SeatWithRelations = Prisma.Result<typeof prisma.seat, {
    include: {
        schedules: true;
    };
}, 'findUnique'>;
//# sourceMappingURL=seat.types.d.ts.map