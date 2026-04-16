import { CreatePayment, GetPayment, GetManyPayment, GetManyPaymentByMonth } from "@final/shared";
import { paymentModel } from "./payment.model.js";

export const paymentService = {
    /*********
    |   READ  |
     *********/
    get: async (filters: GetPayment) => {
        return await paymentModel.get(filters);
    },

    getMany: async (filters: GetManyPayment) => {
        return await paymentModel.getMany(filters);
    },

    getManyByMonth: async (filters: GetManyPaymentByMonth) => {
        return await paymentModel.getManyByMonth(filters)
    },

    /***********
    |   CREATE  |
     ***********/
    create: async (data: CreatePayment) => {
        return await paymentModel.create(data);
    },

    
};
