import 'dotenv/config';
import { LoginData, CreatePerson, UserCredentials } from '@final/shared';
export declare const authService: {
    login: (userData: LoginData) => Promise<UserCredentials>;
    register: (data: CreatePerson) => Promise<{
        person_id: number;
        first_name: string;
        last_name: string;
        email: string;
        password: string | null;
        type: import("@prisma/client").$Enums.PersonType;
    }>;
    createToken: (data: UserCredentials) => string;
};
//# sourceMappingURL=auth.services.d.ts.map