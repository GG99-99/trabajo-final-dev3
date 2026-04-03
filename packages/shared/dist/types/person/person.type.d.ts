export type PersonForCreate = {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    type: "client" | "worker" | "cashier";
    specialty?: "realism" | "cartoon" | "other";
    medical_notes?: string;
};
//# sourceMappingURL=person.type.d.ts.map