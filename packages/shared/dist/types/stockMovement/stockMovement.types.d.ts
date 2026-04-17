import type { $Enums } from "@final/db";
/*****************
|   READ METHODS  |
 *****************/
export type GetStockMovementFilters = {
    stock_movement_id?: number;
    inventory_item_id?: number;
    type?: "entry" | "exit" | "waste";
    create_at?: Date;
    quantity?: number;
};
export type GetManyStockMovementFilters = {
    stock_movement_id?: number;
    inventory_item_id?: number;
    type?: "entry" | "exit" | "waste";
    create_at?: Date;
    quantity?: number;
};
/*******************
|   CREATE METHODS  |
 *******************/
export type CreateStockMovement = {
    inventory_item_id: number;
    quantity: number;
    reason: string;
    type: $Enums.StockMovementType;
};
export type CreateStockMovementFromProduct = {
    product_variant_id: number;
    quantity: number;
    reason: string;
    type: $Enums.StockMovementType;
};
//# sourceMappingURL=stockMovement.types.d.ts.map