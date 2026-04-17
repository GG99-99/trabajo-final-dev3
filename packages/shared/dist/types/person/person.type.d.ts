export type CreatePerson = {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    type: "client" | "worker" | "cashier";
    specialty?: "realism" | "cartoon" | "other";
    medical_notes?: string;
};
export type GetPerson = {
    person_id?: number;
    email?: string;
    noPass?: boolean;
};
//# sourceMappingURL=person.type.d.ts.map