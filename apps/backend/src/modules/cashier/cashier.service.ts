import { CashierPublic, CashierWithPerson, CreatePerson } from "@final/shared";
import { cashierModel } from "./cashier.model.js";
import { personService } from "../person/person.service.js";
import { cashierUtils } from "./cashier.utils.js";

export const cashierService = {
    get: async (cashier_id: number) => {
        return await cashierModel.get(cashier_id)
    },
    getMany: async () => {
        /********************************
        |   BUSCAR TODOS LOS CASHIERS  |
         ********************************/
        const cashiers: CashierWithPerson[] = await cashierModel.getMany()
        const publicCashiers: CashierPublic[] = []

        /***************************************************
        |   QUITAR PASSWORD Y RETORNAR COMO UN SOLO OBJETO  |
         ***************************************************/
        if(cashiers.length === 0) return []
        for(const c of cashiers) publicCashiers.push(cashierUtils.cashierToPublic(c))



        return publicCashiers

    },
    create: async (data: CreatePerson)=>{
        return personService.create(data)
    }
}
