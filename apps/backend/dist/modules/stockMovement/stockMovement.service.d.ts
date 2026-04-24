import { GetStockMovementFilters, CreateStockMovement, CreateStockMovementFromProduct } from "@final/shared";
import { Prisma } from "@final/db";
export declare const stockMovementService: {
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
    getCost: (stock_movement_id: number, tx?: Prisma.TransactionClient) => Promise<number>;
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
    createForProductVariant: (data: CreateStockMovementFromProduct, tx: Prisma.TransactionClient) => Promise<{
        type: import("@final/db").$Enums.StockMovementType;
        create_at: Date;
        quantity: Prisma.Decimal;
        stock_movement_id: number;
        inventory_item_id: number;
        reason: string | null;
    }>;
    createForTatto: () => Promise<void>;
};
//# sourceMappingURL=stockMovement.service.d.ts.map