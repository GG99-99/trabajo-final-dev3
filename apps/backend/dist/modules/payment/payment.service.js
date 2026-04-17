import { paymentModel } from "./payment.model.js";
import prisma from "@final/db";
import { billService } from "../bill/bill.service.js";
import { appointmentService } from '../appointment/appointment.service.js';
export const paymentService = {
    /*********
    |   READ  |
     *********/
    get: async (filters) => {
        return await paymentModel.get(filters);
    },
    getMany: async (filters) => {
        return await paymentModel.getMany(filters);
    },
    getManyByMonth: async (filters) => {
        return await paymentModel.getManyByMonth(filters);
    },
    /***********
    |   CREATE  |
     ***********/
    create: async (data) => {
        return await prisma.$transaction(async (tx) => {
            /********************
            |   OBTENER FACTURA  |
             ********************/
            const bill = await billService.get({ bill_id: data.bill_id });
            if (!bill) {
                throw {
                    name: "UnexistBill",
                    statusCode: 404,
                    message: "La factura no existe"
                };
            }
            const billFinance = await billService.getTotal(data.bill_id);
            if (billFinance.debt === 0) {
                throw {
                    name: "BillIsPaid",
                    statusCode: 400,
                    message: "La factura a sido pagada, no se puede registrar mas pagos"
                };
            }
            /*******************************
            |   INICIO DEL PROCESO DE PAGO  |
             *******************************/
            if (bill.appointment_id) {
                await appointmentService.updateStatus(bill.appointment_id, "completed", tx);
            }
            /****************
            |   PAGO EXACTO  |
             ****************/
            if (data.amount === billFinance.debt) {
                const payment = await paymentModel.create(data, tx);
                await billService.updateState({
                    bill_id: data.bill_id,
                    status: "paid"
                }, tx);
                return {
                    bill_id: data.bill_id,
                    cashier_id: data.cashier_id,
                    amount_paid: data.amount,
                    method: data.method,
                    payment_id: payment?.payment_id,
                    devolution: 0,
                    debt: 0,
                };
            }
            /******************
            |   PAGO DE ABONO  |
             ******************/
            if (data.amount < billFinance.debt) {
                const payment = await paymentModel.create(data, tx);
                await billService.updateState({
                    bill_id: data.bill_id,
                    status: "partially"
                }, tx);
                return {
                    bill_id: data.bill_id,
                    cashier_id: data.cashier_id,
                    amount_paid: data.amount,
                    method: data.method,
                    payment_id: payment?.payment_id,
                    devolution: 0,
                    debt: billFinance.debt - data.amount,
                };
            }
            /***************
            |   SOBRE PAGO  |
             ***************/
            if (data.amount > billFinance.debt) {
                const payment = await paymentModel.create(data, tx);
                await billService.updateState({
                    bill_id: data.bill_id,
                    status: "paid"
                }, tx);
                return {
                    bill_id: data.bill_id,
                    cashier_id: data.cashier_id,
                    amount_paid: data.amount,
                    method: data.method,
                    payment_id: payment?.payment_id,
                    devolution: data.amount - billFinance.debt,
                    debt: 0,
                };
            }
            throw {
                name: "UnknownPayment",
                statusCode: 404,
                message: "Ocurrieron cosas raras"
            };
            // return await paymentModel.create(data, tx);
        });
    },
};
//# sourceMappingURL=payment.service.js.map