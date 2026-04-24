import { ClientWithRelations } from "@final/shared";
export declare const clientModel: {
    /*********
    |   READ  |
     *********/
    get: (client_id: number) => Promise<{
        person_id: number;
        medical_notes: string | null;
        client_id: number;
    } | null>;
    getMany: () => Promise<ClientWithRelations[]>;
    getByEmail: (email: string) => Promise<ClientWithRelations | null>;
    /***********
    |   CREATE  |
     ***********/
    create: () => Promise<void>;
};
//# sourceMappingURL=client.model.d.ts.map