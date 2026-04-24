import 'dotenv/config';
import { LoginData, CreatePerson, UserCredentials, CashierJwtPayload } from '@final/shared';
export declare const authService: {
    login: (userData: LoginData) => Promise<UserCredentials>;
    register: (data: CreatePerson) => Promise<{
        person_id: number;
        first_name: string;
        last_name: string;
        email: string;
        password: string | null;
        type: import("@prisma/client").$Enums.PersonType;
        tag: string | null;
        is_deleted: boolean;
    }>;
    createToken: (data: UserCredentials) => string;
    loginCashier: (userData: LoginData) => Promise<CashierJwtPayload>;
    createCashierToken: (data: CashierJwtPayload) => string;
};
//# sourceMappingURL=auth.services.d.ts.map