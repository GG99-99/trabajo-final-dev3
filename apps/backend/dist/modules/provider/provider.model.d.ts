import { GetProvider, ProviderWithRelations } from "@final/shared";
export declare const providerModel: {
    get: (filters: GetProvider) => Promise<ProviderWithRelations | null>;
    getMany: () => Promise<ProviderWithRelations[]>;
};
//# sourceMappingURL=provider.model.d.ts.map