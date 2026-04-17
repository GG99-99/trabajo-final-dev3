import { CreateProvider } from "@final/shared";
interface SeedProvider extends CreateProvider {
    provider_id: number;
}
export declare const providers_seed: SeedProvider[];
export declare function seedProviders(): Promise<void>;
export {};
//# sourceMappingURL=seed.providers.d.ts.map