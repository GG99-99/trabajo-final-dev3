import { CreateProvider, GetProvider, ProviderWithRelations } from "@final/shared";
export declare const providerModel: {
    /*********
    |   READ  |
     *********/
    get: (filters: GetProvider) => Promise<ProviderWithRelations | null>;
    getMany: () => Promise<ProviderWithRelations[]>;
    /***********
    |   CREATE  |
     ***********/
    create: (data: CreateProvider) => Promise<{
        name: string;
        provider_id: number;
        code: string;
        phone_number: string;
        address: string;
    }>;
};
//# sourceMappingURL=provider.model.d.ts.map