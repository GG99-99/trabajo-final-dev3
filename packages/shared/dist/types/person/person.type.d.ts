export type CreatePerson = {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    type: "worker" | "cashier" | "client";
    token?: string;
    specialty?: "realism" | "cartoon" | "other";
    medical_notes?: string;
};
export type GetPerson = {
    person_id?: number;
    email?: string;
    noPass?: boolean;
};
//# sourceMappingURL=person.type.d.ts.map