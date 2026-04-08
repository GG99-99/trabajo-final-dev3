import type { PersonForCreate } from "../person/person.type.js";
import type { Override } from "../index.types.js";
export type ClientCreate = Override<PersonForCreate, {
    type: "client";
}>;
export type ClientWithPerson = {
    client_id: number;
    person_id: number;
    medical_notes: string | null;
    person: {
        person_id: number;
        first_name: string;
        last_name: string;
        email: string;
        password: string | null;
        type: string;
    };
} | null;
export type ClientPublic = {
    client_id: number;
    person_id: number;
    medical_notes: string | null;
    first_name: string;
    last_name: string;
    email: string;
    type: string;
};
//# sourceMappingURL=client.types.d.ts.map