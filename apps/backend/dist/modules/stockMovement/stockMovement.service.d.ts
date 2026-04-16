import { GetStockMovementFilters } from "@final/shared";
export declare const sotckMovementService: {
    get: (filters: GetStockMovementFilters) => Promise<{
        type: import("@prisma/index.js").$Enums.StockMovementType;
        create_at: Date;
        inventory_item_id: number;
        stock_movement_id: number;
        quantity: GetStockMovementFilters;
        reason: string | null;
    } | null>;
};
//# sourceMappingURL=stockMovement.service.d.ts.map