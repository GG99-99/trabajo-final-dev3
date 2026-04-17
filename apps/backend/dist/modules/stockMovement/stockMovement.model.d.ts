import { Prisma } from "@final/db";
import { GetManyStockMovementFilters, GetStockMovementFilters, CreateStockMovement } from "@final/shared";
export declare const stockMovementModel: {
    get: (filters: GetStockMovementFilters) => Promise<{
        type: import("@final/db").$Enums.StockMovementType;
        create_at: Date;
        stock_movement_id: number;
        inventory_item_id: number;
        quantity: Prisma.Decimal;
        reason: string | null;
    } | null>;
    getMany: (filters: GetManyStockMovementFilters) => Promise<{
        type: import("@final/db").$Enums.StockMovementType;
        create_at: Date;
        stock_movement_id: number;
        inventory_item_id: number;
        quantity: Prisma.Decimal;
        reason: string | null;
    }[]>;
    /***********
    |   CREATE  |
     ***********/
    create: (data: CreateStockMovement, tx: Prisma.TransactionClient) => Promise<{
        type: import("@final/db").$Enums.StockMovementType;
        create_at: Date;
        stock_movement_id: number;
        inventory_item_id: number;
        quantity: Prisma.Decimal;
        reason: string | null;
    }>;
};
//# sourceMappingURL=stockMovement.model.d.ts.map