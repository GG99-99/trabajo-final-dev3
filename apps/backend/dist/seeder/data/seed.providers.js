import prisma from "@final/db";
export const providers_seed = [
    {
        provider_id: 1,
        name: "provider1",
        code: "0099AA",
        phone_number: "8091234567",
        address: "Av. Providers, 1234, City, Country"
    },
    {
        provider_id: 2,
        name: "provider2",
        code: "77UIK0",
        phone_number: "8099876543",
        address: "Av. Providers, 5678, Vider, Pr"
    },
    {
        provider_id: 3,
        name: "provider3",
        code: "333333",
        phone_number: "8099876543",
        address: "Av. Providers, 5678, Vider, Pr"
    },
    {
        provider_id: 4,
        name: "provider4",
        code: "444444",
        phone_number: "8099876543",
        address: "Av. Providers, 5678, Vider, Pr"
    },
    {
        provider_id: 5,
        name: "provider5",
        code: "555555",
        phone_number: "8099876543",
        address: "Av. Providers, 5678, Vider, Pr"
    },
];
export async function seedProviders() {
    for (const p of providers_seed) {
        await prisma.provider.upsert({
            where: { provider_id: p.provider_id },
            update: {},
            create: { ...p }
        });
    }
}
//# sourceMappingURL=seed.providers.js.map