export type UserCredentials = {
    email: string;
    person_id: number;
    type: 'client' | 'worker' | 'cashier';
    tag?: string | null;
};
export type CashierJwtPayload = {
    email: string;
    person_id: number;
    type: 'cashier';
    cashier_id: number;
    tag?: string | null;
};
//# sourceMappingURL=users.type.d.ts.map