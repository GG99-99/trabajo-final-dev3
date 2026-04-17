import { ClientCreate, ClientPublic } from "@final/shared";
export declare const clientService: {
    get: (client_id: number) => Promise<{
        person_id: number;
        medical_notes: string | null;
        client_id: number;
    } | null>;
    getMany: () => Promise<ClientPublic[]>;
    create: (data: ClientCreate) => Promise<{
        person_id: number;
        first_name: string;
        last_name: string;
        email: string;
        password: string | null;
        type: import("@prisma/client").$Enums.PersonType;
    }>;
};
//# sourceMappingURL=client.service.d.ts.map