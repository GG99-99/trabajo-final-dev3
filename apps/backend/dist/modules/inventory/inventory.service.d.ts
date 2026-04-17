import { GetInventoryFilters, GetQuantityInventoryFilters } from "@final/shared";
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
    getQuantity: (filters: GetQuantityInventoryFilters) => Promise<import("@prisma/index.js").Prisma.GetInventoryItemAggregateType<{
        _sum: {
            current_quantity: true;
        };
        where: {
            product_variant_id: any;
            OR: ({
                expiry_date: null;
            } | {
                expiry_date: {
                    gt: Date;
                };
            })[];
        };
    }>>;
    getExpired: (filters: GetQuantityInventoryFilters) => Promise<({
        productVariant: {
            product_variant_id: number;
            product_id: number;
            presentation: string;
            min_stock_level: number;
            price: GetInventoryFilters;
        };
    } & {
        inventory_item_id: number;
        product_variant_id: number;
        batch_number: string;
        current_quantity: number;
        expiry_date: Date | null;
    })[]>;
};
//# sourceMappingURL=inventory.service.d.ts.map