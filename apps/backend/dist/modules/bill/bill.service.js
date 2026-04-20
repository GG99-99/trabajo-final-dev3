import { stockMovementService } from './../stockMovement/stockMovement.service.js';
import { billModel } from "./bill.model.js";
import prisma from "@final/db";
export const billService = {
    getMany: async (filters) => {
        return await billModel.getMany(filters);
    },
    get: async (filters) => {
        return await billModel.get(filters);
    },
    getTotal: async (bill_id) => {
        // para user [ payments, aggregates, discounts ] directamente desde aqui
        const bill = await billModel.get({ bill_id: bill_id, relations: true });
        if (!bill)
            throw ({});
        // obtener tattoos 
        const tattoos = await billService.getTattoos(bill_id);
        const aggregatesTotal = bill.aggregates.reduce((acc, ag) => acc + Number(ag.amount), 0);
        const tattoosTotal = tattoos.reduce((acc, t) => acc + Number(t.price), 0);
        const discountTotal = bill.discounts.reduce((acc, d) => acc + Number(d.amount), 0);
        const paymentsTotal = bill.payments
            .filter((p) => !p.is_refunded)
            .reduce((acc, p) => acc + Number(p.amount), 0);
        const total = aggregatesTotal + tattoosTotal;
        const rawDebt = total - discountTotal - paymentsTotal;
        const debt = Math.max(0, rawDebt);
        const overpaid = rawDebt < 0 ? Math.abs(rawDebt) : 0;
        return {
            bill_id,
            total, // total bruto (antes de descuentos)
            total_discount: discountTotal, // cuanto se descontó
            total_after_discount: total - discountTotal, // total real a pagar
            debt, // lo que falta por pagar (ya restando pagos)
            overpaid
        };
    },
    getStockMovements: async (bill_id) => {
        return await billModel.getStockMovements(bill_id);
    },
    getTattoos: async (bill_id) => {
        return await billModel.getTattoos(bill_id);
    },
    /***********
    |   CREATE  |
     ***********/
    create: async (data) => {
        return await prisma.$transaction(async (tx) => {
            /***************
            |   CREAR BILL  |
             ***************/
            const bill = await billModel.create({
                client_id: data.client_id,
                worker_id: data.worker_id,
                cashier_id: data.cashier_id,
                appointment_id: data.appointment_id ?? undefined,
                create_at: data.create_at
            }, tx);
            for (const item of data.items) {
                /*****************************************************
                |   CREAR STOCK MOVEMENT DE LOS ITEMS  DE LA FACTURA  |
                 *****************************************************/
                const stockMovement = await stockMovementService.createForProductVariant({
                    product_variant_id: item.product_variant_id,
                    reason: `factura ${bill.bill_id}`,
                    type: "exit",
                    quantity: item.quantity,
                }, tx);
                /**********************
                |   CREAR BILL DETAIL  |
                 **********************/
                await billModel.createBillDetail({
                    bill_id: bill.bill_id,
                    stock_movement_id: stockMovement.stock_movement_id
                }, tx);
            }
            /************************************
            |   CREAR  RELACIONES BILL -> TATTO  |
             ************************************/
            for (const tattoo_id of data.tatto_ids) {
                await billModel.createBillTatto({
                    tattoo_id: tattoo_id,
                    bill_id: bill.bill_id,
                }, tx);
            }
            /**************************
            |   CREAR BILL AGGREGATES  |
             **************************/
            for (const agg of data.extra.aggregates) {
                await billModel.createBillAggregate({
                    bill_id: bill.bill_id,
                    amount: agg.amount,
                    reason: agg.reason
                }, tx);
            }
            /************************
            |   CREAR BILL DISCOUNT  |
             ************************/
            for (const dis of data.extra.discounts) {
                await billModel.createBillDiscount({
                    bill_id: bill.bill_id,
                    amount: dis.amount,
                    reason: dis.reason
                }, tx);
            }
            return bill;
        });
    },
    createBillTattoo: async (data, tx) => {
        return await billModel.createBillTatto(data, tx);
    },
    /***********
    |   UPDATE  |
     ***********/
    updateState: async (data, tx) => {
        return await billModel.updateStatus(data, tx);
    },
    updateStateDirect: async (data) => {
        return await prisma.$transaction(async (tx) => {
            return await billModel.updateStatus(data, tx);
        });
    },
};
//# sourceMappingURL=bill.service.js.map