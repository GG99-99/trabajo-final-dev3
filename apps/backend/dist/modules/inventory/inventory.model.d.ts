import { Prisma } from "@final/db";
import { CreateInventoryItem, GetInventoryFilters, GetNotExpired, GetQuantityInventoryFilters, UpdateQuantity } from "@final/shared";
export declare const inventoryModel: {
    /*********
    |   READ  |
     *********/
    get: (filters: GetInventoryFilters, tx?: Prisma.TransactionClient) => Promise<{
        product_variant_id: number;
        inventory_item_id: number;
        batch_number: string;
        current_quantity: number;
        expiry_date: Date | null;
    } | null>;
    getTotalQuantity: (filters: GetQuantityInventoryFilters) => Promise<Prisma.GetInventoryItemAggregateType<{
        _sum: {
            current_quantity: true;
        };
        where: {
            product_variant_id: number;
            OR: ({
                expiry_date: null;
            } | {
                expiry_date: {
                    gt: Date;
                };
            })[];
        };
    }>>;
    getNotExpired: (filters: GetNotExpired, tx?: Prisma.TransactionClient) => Promise<({
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
    }) | null>;
    getManyNotExpired: (filters: GetNotExpired) => Promise<({
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
    })[]>;
    /***********
    |   UPDATE  |
     ***********/
    updateQuantity: (data: UpdateQuantity, tx: Prisma.TransactionClient) => Promise<{
        product_variant_id: number;
        inventory_item_id: number;
        batch_number: string;
        current_quantity: number;
        expiry_date: Date | null;
    }>;
    /***********
    |   CREATE  |
     ***********/
    create: (data: CreateInventoryItem, tx: Prisma.TransactionClient) => Promise<{
        product_variant_id: number;
        inventory_item_id: number;
        batch_number: string;
        current_quantity: number;
        expiry_date: Date | null;
    }>;
};
//# sourceMappingURL=inventory.model.d.ts.map