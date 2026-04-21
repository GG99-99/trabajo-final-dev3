import prisma, {  Prisma } from "@final/db"
import { BillWithRelations, GetManyBill, GetBill, CreateBill, CreateBillTattoo, CreateBillDetail, UpdateBillStatus, CreateBillAggregate, CreateBillDiscount, BillProductItem, BillTattooItem } from "@final/shared"
import { toStartOfDay, toEndOfDay } from "#backend/utils"


export const billModel = {
    /*********
    |   READ  |
     *********/
    get: async (filters: GetBill): Promise<BillWithRelations| null> => {
        return await prisma.bill.findUnique({
            where: {bill_id: filters.bill_id},
            include: {
                details: filters.relations || undefined, 
                tattoos: filters.relations || undefined, 
                payments: filters.relations || undefined,
                aggregates: filters.relations || undefined,
                discounts: filters.relations || undefined,
                client: {
                    include: {person: filters.relations || undefined}
                },
                worker: {
                    include: {person: filters.relations || undefined}
                },
            }
        })
    },
    getMany: async (filters: GetManyBill): Promise<BillWithRelations[]> => {

        
        return await prisma.bill.findMany({
            where: {
                ...(filters.date && {create_at: {
                        gte: toStartOfDay(filters.date),
                        lte: toEndOfDay(filters.date),
                    }}),
                ...(filters.status && {status: filters.status}),
                ...(filters.client_id && {client_id: filters.client_id}),
                ...(filters.cashier_id && {cashier_id: filters.cashier_id}),

            },
            include :{
                details: true, 
                tattoos: true, 
                payments: true,
                aggregates: true,
                discounts: true,
                client: {
                    include: {person: true}
                },
                worker: {
                    include: {person: true}
                },
            }
        })
    },
    getStockMovements: async (bill_id: number) => {
        const billProducts =  await prisma.billDetail.findMany({
                where: {
                    bill_id: bill_id,
                },
                select: {
                    stockMovement: {
                    select: {
                        quantity: true,
                        inventory_item_id: true,
                        inventoryItem: {
                        select: {
                            productVariant: {
                            select: {
                                presentation: true,
                                price: true,
                                product: {
                                select: {
                                    name: true,
                                },
                                },
                            },
                            },
                        },
                        },
                    },
                    },
                },
            });
        
        const result: BillProductItem[] = billProducts
            .filter((detail) => detail.stockMovement !== null)
            .map((detail) => ({
                product_name:               detail.stockMovement.inventoryItem.productVariant.product.name,
                presentation:               detail.stockMovement.inventoryItem.productVariant.presentation,
                price:                      Number(detail.stockMovement.inventoryItem.productVariant.price),
                stock_movement_quantity:    Number(detail.stockMovement.quantity),
                inventory_item_id:          detail.stockMovement.inventory_item_id,
            }));

        return result
    },
    getTattoos: async (bill_id: number) => {
        const billTattoos = await prisma.billTattoo.findMany({
            where: {
                bill_id: bill_id,
            },
            select: {
                tattoo: {
                    select: {
                        tattoo_id: true,
                        cost: true,
                    },
                },
            },
        });

        const result: BillTattooItem[] = billTattoos
            .filter((detail) => detail.tattoo !== null)
            .map((detail) => ({
                tattoo_id: detail.tattoo.tattoo_id,
                price: Number(detail.tattoo.cost),
            }))

        return result
    },
    

    /***********
    |   CREATE  |
     ***********/
    create: async (data: CreateBill, tx: Prisma.TransactionClient) => {
        return await tx.bill.create({
            data: {...data}
        })
    },
    
    createBillDetail: async (data: CreateBillDetail, tx: Prisma.TransactionClient) => {
        return await tx.billDetail.create({
            data: {...data}
        })
    },

  
    createBillTatto: async (data: CreateBillTattoo, tx: Prisma.TransactionClient) => {
        return await tx.billTattoo.create({
            data: {
                ...data
            }
        })
    },

    createBillAggregate: async (data: CreateBillAggregate, tx: Prisma.TransactionClient) => {
        return await tx.billAggregate.create({
            data: {...data}
        })
    },

    createBillDiscount: async (data: CreateBillDiscount, tx: Prisma.TransactionClient) => {
        return await tx.billDiscount.create({
            data: {...data}
        })
    },

    /***********
    |   UPDATE  |
     ***********/
    updateStatus: async (data: UpdateBillStatus, tx: Prisma.TransactionClient) => {
        return await tx.bill.update({
            where: {bill_id: data.bill_id},
            data: {
                status: data.status
            }
        })
    }
}