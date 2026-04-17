import { GetProvider, CreateProvider } from "@final/shared";
export declare const providerService: {
    /*********
    |   READ  |
     *********/
    get: (filters: GetProvider) => Promise<({
        products: {
            name: string;
            product_id: number;
            category_id: number;
            provider_id: number;
            brand: string;
        }[];
    } & {
        name: string;
        provider_id: number;
        code: string;
        phone_number: string;
        address: string;
    }) | null>;
    getMany: () => Promise<(({
        products: {
            name: string;
            product_id: number;
            category_id: number;
            provider_id: number;
            brand: string;
        }[];
    } & {
        name: string;
        provider_id: number;
        code: string;
        phone_number: string;
        address: string;
    }) | null)[]>;
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
//# sourceMappingURL=provider.service.d.ts.map