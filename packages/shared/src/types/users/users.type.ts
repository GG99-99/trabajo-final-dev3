

// este es tipo que se almacenara en el jwt_token
export type UserCredentials = {
    email: string;
    person_id: number;
    type: 'client' | 'worker' | 'cashier';
}