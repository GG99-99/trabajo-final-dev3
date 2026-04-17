import { cashierModel } from "./cashier.model.js";
import { personService } from "../person/person.service.js";
import { cashierUtils } from "./cashier.utils.js";
export const cashierService = {
    get: async (cashier_id) => {
        return await cashierModel.get(cashier_id);
    },
    getMany: async () => {
        /********************************
        |   BUSCAR TODOS LOS CASHIERS  |
         ********************************/
        const cashiers = await cashierModel.getMany();
        const publicCashiers = [];
        /***************************************************
        |   QUITAR PASSWORD Y RETORNAR COMO UN SOLO OBJETO  |
         ***************************************************/
        if (cashiers.length === 0)
            return [];
        for (const c of cashiers)
            publicCashiers.push(cashierUtils.cashierToPublic(c));
        return publicCashiers;
    },
    create: async (data) => {
        return personService.create(data);
    }
};
//# sourceMappingURL=cashier.service.js.map