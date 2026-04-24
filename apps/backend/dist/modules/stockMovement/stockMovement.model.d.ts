import { Prisma } from "@final/db";
import { GetManyStockMovementFilters, GetStockMovementFilters, CreateStockMovement } from "@final/shared";
export declare const stockMovementModel: {
    get: (filters: GetStockMovementFilters, tx?: Prisma.TransactionClient) => Promise<({
        inventoryItem: {
            productVariant: {
                product_variant_id: number;
                product_id: number;
                presentation: string;
                min_stock_level: number;
                price: Prisma.Decimal;
                unit: string;
            };
        } & {
            product_variant_id: number;
            inventory_item_id: number;
            batch_number: string;
            current_quantity: number;
            expiry_date: Date | null;
        };
    } & {
        type: import("@final/db").$Enums.StockMovementType;
        create_at: Date;
        quantity: Prisma.Decimal;
        stock_movement_id: number;
        inventory_item_id: number;
        reason: string | null;
    }) | null>;
    getMany: (filters: GetManyStockMovementFilters) => Promise<{
        type: import("@final/db").$Enums.StockMovementType;
        create_at: Date;
        quantity: Prisma.Decimal;
        stock_movement_id: number;
        inventory_item_id: number;
        reason: string | null;
    }[]>;
    /***********
    |   CREATE  |
     ***********/
    create: (data: CreateStockMovement, tx: Prisma.TransactionClient) => Promise<{
        type: import("@final/db").$Enums.StockMovementType;
        create_at: Date;
        quantity: Prisma.Decimal;
        stock_movement_id: number;
        inventory_item_id: number;
        reason: string | null;
    }>;
};
//# sourceMappingURL=stockMovement.model.d.ts.map