import { paymentModel } from "./payment.model.js";
export const paymentService = {
    create: async (data) => {
        return await paymentModel.create(data);
    },
    get: async (filters) => {
        return await paymentModel.get(filters);
    },
    getMany: async (filters) => {
        return await paymentModel.getMany(filters);
    },
};
//# sourceMappingURL=payment.service.js.map