import type { PersonForCreate } from "../person/person.type.js"
import type { Override } from "../index.types.js"

export type CashierCreate = Override<PersonForCreate, {type: "cashier"}> 


export type CashierWithPerson = {
    cashier_id: number;
    person_id: number;
    person: {
        person_id: number;
        first_name: string;
        last_name: string;
        email: string;
        password: string | null;
        type: string;
    }; 
} | null;

export type CashierPublic = {
    cashier_id: number,
    person_id: number,
    first_name: string,
    last_name: string,
    email: string,
    type: string
}
