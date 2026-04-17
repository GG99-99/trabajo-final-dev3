import { Prisma } from "@final/db";
import { GetInventoryFilters, GetQuantityInventoryFilters, UpdateQuantity, CreateInventoryItem, GetNotExpired } from "@final/shared";
export declare const inventoryService: {
    /*********
    |   READ  |
     *********/
    get: (filters: GetInventoryFilters) => Promise<{
        inventory_item_id: number;
        product_variant_id: number;
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
    getNotExpired: (filters: GetNotExpired) => Promise<({
        productVariant: {
            product_variant_id: number;
            product_id: number;
            presentation: string;
            min_stock_level: number;
            price: Prisma.Decimal;
            unit: string;
        };
    } & {
        inventory_item_id: number;
        product_variant_id: number;
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
        inventory_item_id: number;
        product_variant_id: number;
        batch_number: string;
        current_quantity: number;
        expiry_date: Date | null;
    })[]>;
    /***********
    |   UPDATE  |
     ***********/
    updateQuantity: (data: UpdateQuantity, tx: Prisma.TransactionClient) => Promise<{
        inventory_item_id: number;
        product_variant_id: number;
        batch_number: string;
        current_quantity: number;
        expiry_date: Date | null;
    }>;
    updateQuantityDirect: (data: UpdateQuantity) => Promise<{
        inventory_item_id: number;
        product_variant_id: number;
        batch_number: string;
        current_quantity: number;
        expiry_date: Date | null;
    }>;
    /***********
    |   CREATE  |
     ***********/
    create: (data: CreateInventoryItem) => Promise<{
        inventory_item_id: number;
        product_variant_id: number;
        batch_number: string;
        current_quantity: number;
        expiry_date: Date | null;
    }>;
};
//# sourceMappingURL=inventory.service.d.ts.map