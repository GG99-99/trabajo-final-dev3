import type { $Enums, Prisma  } from "@final/db";


/*****************
|   READ METHODS  |
 *****************/

export type GetInventoryFilters = {
    inventory_item_id: number;
    gte?: number;
}

export type GetQuantityInventoryFilters = {
    product_variant_id: number;
}

export type GetNotExpired = {
    product_variant_id: number;
    gte?: number;
}

/***********
|   UPDATE  |
 ***********/
export type UpdateQuantity = {
    inventory_item_id: number;
    quantity: number;
    type: $Enums.StockMovementType
}




/***********
|   CREATE  |
 ***********/

export type CreateInventoryItem = {
    product_variant_id: number;
    batch_number: string;
    current_quantity: number;
    expiry_date?: Date;
}