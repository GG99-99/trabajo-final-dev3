import { CashierPublic, CashierWithPerson } from "@final/shared";


export const cashierUtils = {
    cashierToPublic: (c: CashierWithPerson): CashierPublic => {
        return {
            cashier_id: c!.cashier_id,
            person_id: c!.person_id,
            first_name: c!.person.first_name,
            last_name: c!.person.last_name,
            email: c!.person.email,
            type: c!.person.type
        }
    }
}
