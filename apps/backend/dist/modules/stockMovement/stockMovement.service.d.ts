import { GetStockMovementFilters, CreateStockMovement, CreateStockMovementFromProduct } from "@final/shared";
import { Prisma } from "@final/db";
export declare const stockMovementService: {
    get: (filters: GetStockMovementFilters) => Promise<{
        type: import("@final/db").$Enums.StockMovementType;
        create_at: Date;
        stock_movement_id: number;
        inventory_item_id: number;
        quantity: Prisma.Decimal;
        reason: string | null;
    } | null>;
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
    createForProductVariant: (data: CreateStockMovementFromProduct, tx: Prisma.TransactionClient) => Promise<{
        type: import("@final/db").$Enums.StockMovementType;
        create_at: Date;
        stock_movement_id: number;
        inventory_item_id: number;
        quantity: Prisma.Decimal;
        reason: string | null;
    }>;
    createForTatto: () => Promise<void>;
};
//# sourceMappingURL=stockMovement.service.d.ts.map