

// este es tipo que se almacenara en el jwt_token
export type UserCredentials = {
    email: string;
    person_id: number;
    type: 'client' | 'worker' | 'cashier';
    tag?: string | null;
}

/** Payload del JWT en la cookie `cashier_jwt` (checkout). */
export type CashierJwtPayload = {
    email: string;
    person_id: number;
    type: 'cashier';
    cashier_id: number;
    tag?: string | null;
}