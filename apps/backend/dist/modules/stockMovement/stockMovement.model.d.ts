import { GetManyStockMovementFilters, GetStockMovementFilters } from "@final/shared";
export declare const stockMovementModel: {
    get: (filters: GetStockMovementFilters) => Promise<{
        type: import("@prisma/index.js").$Enums.StockMovementType;
        create_at: Date;
        inventory_item_id: number;
        stock_movement_id: number;
        quantity: GetManyStockMovementFilters;
        reason: string | null;
    } | null>;
    getMany: (filters: GetManyStockMovementFilters) => Promise<{
        type: import("@prisma/index.js").$Enums.StockMovementType;
        create_at: Date;
        inventory_item_id: number;
        stock_movement_id: number;
        quantity: GetManyStockMovementFilters;
        reason: string | null;
    }[]>;
};
//# sourceMappingURL=stockMovement.model.d.ts.map