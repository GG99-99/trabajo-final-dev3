import prisma from "@final/db";


// ---------------------------------------------------------------------------
// Product + ProductVariant data
// category_id and provider_id reference the order of the seeded records:
//   Categories:  1=Tintas | 2=Agujas | 3=Higiene y Protección
//                4=Cuidado Post-Tatuaje | 5=Equipos y Accesorios
//   Providers:   1=Dynamic Color | 2=Intenze | 3=Cheyenne
//                4=Kwadron | 5=TatSoul
// ---------------------------------------------------------------------------

export const productData = [
    // ── TINTAS (category 1) ─────────────────────────────────────────────────
    {
        category_id: 1,
        provider_id: 1, // Dynamic Color Co.
        name: "Dynamic Black Ink",
        brand: "Dynamic Color Co.",
        variants: [
            {
                presentation: "Frasco 1 oz (30 ml)",
                min_stock_level: 10,
                price: 8.99,
                unit: "frasco",
            },
            {
                presentation: "Frasco 4 oz (120 ml)",
                min_stock_level: 5,
                price: 24.99,
                unit: "frasco",
            },
            {
                presentation: "Frasco 8 oz (240 ml)",
                min_stock_level: 3,
                price: 44.99,
                unit: "frasco",
            },
        ],
    },
    {
        category_id: 1,
        provider_id: 2, // Intenze
        name: "Intenze True Black",
        brand: "Intenze Products",
        variants: [
            {
                presentation: "Frasco 1 oz (30 ml)",
                min_stock_level: 10,
                price: 9.5,
                unit: "frasco",
            },
            {
                presentation: "Frasco 2 oz (60 ml)",
                min_stock_level: 5,
                price: 16.5,
                unit: "frasco",
            },
        ],
    },
    {
        category_id: 1,
        provider_id: 2, // Intenze
        name: "Intenze Color Set Básico",
        brand: "Intenze Products",
        variants: [
            {
                presentation: "Set 6 colores x 1 oz",
                min_stock_level: 3,
                price: 54.99,
                unit: "set",
            },
            {
                presentation: "Set 12 colores x 1 oz",
                min_stock_level: 2,
                price: 99.99,
                unit: "set",
            },
        ],
    },
    {
        category_id: 1,
        provider_id: 1, // Dynamic Color Co.
        name: "Dynamic Tribal Black",
        brand: "Dynamic Color Co.",
        variants: [
            {
                presentation: "Frasco 4 oz (120 ml)",
                min_stock_level: 5,
                price: 22.0,
                unit: "frasco",
            },
        ],
    },

    // ── AGUJAS (category 2) ─────────────────────────────────────────────────
    {
        category_id: 2,
        provider_id: 4, // Kwadron
        name: "Kwadron Cartridge Round Liner",
        brand: "Kwadron",
        variants: [
            {
                presentation: "Caja 20 unidades #5 (0.35mm) 1RL",
                min_stock_level: 5,
                price: 28.0,
                unit: "caja",
            },
            {
                presentation: "Caja 20 unidades #10 (0.30mm) 3RL",
                min_stock_level: 5,
                price: 28.0,
                unit: "caja",
            },
            {
                presentation: "Caja 20 unidades #12 (0.35mm) 5RL",
                min_stock_level: 5,
                price: 28.0,
                unit: "caja",
            },
        ],
    },
    {
        category_id: 2,
        provider_id: 4, // Kwadron
        name: "Kwadron Cartridge Round Shader",
        brand: "Kwadron",
        variants: [
            {
                presentation: "Caja 20 unidades #12 (0.35mm) 7RS",
                min_stock_level: 5,
                price: 28.0,
                unit: "caja",
            },
            {
                presentation: "Caja 20 unidades #12 (0.35mm) 14RS",
                min_stock_level: 5,
                price: 28.0,
                unit: "caja",
            },
        ],
    },
    {
        category_id: 2,
        provider_id: 4, // Kwadron
        name: "Kwadron Cartridge Magnum",
        brand: "Kwadron",
        variants: [
            {
                presentation: "Caja 20 unidades #12 (0.35mm) 9M1",
                min_stock_level: 5,
                price: 30.0,
                unit: "caja",
            },
            {
                presentation: "Caja 20 unidades #12 (0.35mm) 15M1",
                min_stock_level: 5,
                price: 30.0,
                unit: "caja",
            },
        ],
    },
    {
        category_id: 2,
        provider_id: 3, // Cheyenne
        name: "Cheyenne Hawk Cartridge",
        brand: "Cheyenne",
        variants: [
            {
                presentation: "Caja 20 unidades Safety #10 1RL",
                min_stock_level: 5,
                price: 35.0,
                unit: "caja",
            },
            {
                presentation: "Caja 20 unidades Safety #12 5RL",
                min_stock_level: 5,
                price: 35.0,
                unit: "caja",
            },
            {
                presentation: "Caja 20 unidades Safety #12 7M1",
                min_stock_level: 5,
                price: 35.0,
                unit: "caja",
            },
        ],
    },

    // ── HIGIENE Y PROTECCIÓN (category 3) ───────────────────────────────────
    {
        category_id: 3,
        provider_id: 5, // TatSoul
        name: "Guantes de Nitrilo Sin Polvo",
        brand: "MedLine",
        variants: [
            {
                presentation: "Caja 100 unidades Talla S",
                min_stock_level: 10,
                price: 12.5,
                unit: "caja",
            },
            {
                presentation: "Caja 100 unidades Talla M",
                min_stock_level: 10,
                price: 12.5,
                unit: "caja",
            },
            {
                presentation: "Caja 100 unidades Talla L",
                min_stock_level: 10,
                price: 12.5,
                unit: "caja",
            },
        ],
    },
    {
        category_id: 3,
        provider_id: 5, // TatSoul
        name: "Film Barrier Transparente",
        brand: "TatSoul",
        variants: [
            {
                presentation: "Rollo 10cm x 100m",
                min_stock_level: 5,
                price: 18.0,
                unit: "rollo",
            },
            {
                presentation: "Rollo 15cm x 100m",
                min_stock_level: 5,
                price: 22.0,
                unit: "rollo",
            },
        ],
    },
    {
        category_id: 3,
        provider_id: 5, // TatSoul
        name: "Spray Desinfectante Green Soap",
        brand: "Cosco",
        variants: [
            {
                presentation: "Botella 500 ml",
                min_stock_level: 8,
                price: 7.99,
                unit: "botella",
            },
            {
                presentation: "Galón 3.78 L",
                min_stock_level: 3,
                price: 24.99,
                unit: "galón",
            },
        ],
    },
    {
        category_id: 3,
        provider_id: 5, // TatSoul
        name: "Vaselina Sin Perfume",
        brand: "Unilever",
        variants: [
            {
                presentation: "Tarro 100 g",
                min_stock_level: 15,
                price: 3.5,
                unit: "tarro",
            },
            {
                presentation: "Tarro 425 g",
                min_stock_level: 5,
                price: 9.5,
                unit: "tarro",
            },
        ],
    },

    // ── CUIDADO POST-TATUAJE (category 4) ───────────────────────────────────
    {
        category_id: 4,
        provider_id: 5, // TatSoul
        name: "Hustle Butter Deluxe",
        brand: "Hustle Butter",
        variants: [
            {
                presentation: "Tarro 150 ml",
                min_stock_level: 10,
                price: 19.99,
                unit: "tarro",
            },
            {
                presentation: "Tarro 300 ml",
                min_stock_level: 5,
                price: 34.99,
                unit: "tarro",
            },
        ],
    },
    {
        category_id: 4,
        provider_id: 5, // TatSoul
        name: "Tattoo Goo Salve",
        brand: "Tattoo Goo",
        variants: [
            {
                presentation: "Tubo 21 g",
                min_stock_level: 15,
                price: 6.5,
                unit: "tubo",
            },
            {
                presentation: "Tarro 57 g",
                min_stock_level: 8,
                price: 14.0,
                unit: "tarro",
            },
        ],
    },
    {
        category_id: 4,
        provider_id: 5, // TatSoul
        name: "Bepanthen Tattoo",
        brand: "Bayer",
        variants: [
            {
                presentation: "Tubo 50 g",
                min_stock_level: 10,
                price: 11.99,
                unit: "tubo",
            },
        ],
    },

    // ── EQUIPOS Y ACCESORIOS (category 5) ───────────────────────────────────
    {
        category_id: 5,
        provider_id: 3, // Cheyenne
        name: "Cheyenne Hawk Thunder",
        brand: "Cheyenne",
        variants: [
            {
                presentation: "Máquina rotativa completa",
                min_stock_level: 1,
                price: 349.99,
                unit: "unidad",
            },
        ],
    },
    {
        category_id: 5,
        provider_id: 3, // Cheyenne
        name: "Cheyenne Hawk Pen",
        brand: "Cheyenne",
        variants: [
            {
                presentation: "Máquina pen completa",
                min_stock_level: 1,
                price: 395.0,
                unit: "unidad",
            },
        ],
    },
    {
        category_id: 5,
        provider_id: 5, // TatSoul
        name: "Fuente de Poder Digital",
        brand: "TatSoul",
        variants: [
            {
                presentation: "Fuente 2 salidas con clip cord",
                min_stock_level: 1,
                price: 89.99,
                unit: "unidad",
            },
        ],
    },
    {
        category_id: 5,
        provider_id: 5, // TatSoul
        name: "Grip Desechable",
        brand: "TatSoul",
        variants: [
            {
                presentation: "Paquete 50 unidades 25mm",
                min_stock_level: 5,
                price: 15.0,
                unit: "paquete",
            },
            {
                presentation: "Paquete 50 unidades 30mm",
                min_stock_level: 5,
                price: 15.0,
                unit: "paquete",
            },
        ],
    },
    {
        category_id: 5,
        provider_id: 5, // TatSoul
        name: "Tazas de Tinta (Ink Caps)",
        brand: "TatSoul",
        variants: [
            {
                presentation: "Bolsa 500 unidades Talla S",
                min_stock_level: 5,
                price: 9.0,
                unit: "bolsa",
            },
            {
                presentation: "Bolsa 500 unidades Talla M",
                min_stock_level: 5,
                price: 9.0,
                unit: "bolsa",
            },
        ],
    },
];

export async function seedProducts()
{
    //   console.log("🌱 Seeding products and product variants...");

    //   let totalProducts = 0;
    //   let totalVariants = 0;

    for (const { variants, ...productInfo } of productData)
{
    const product = await prisma.product.upsert({
        where: {
            name_provider_id: {
                name: productInfo.name,
                provider_id: productInfo.provider_id,
            },
        },
        update: {}, 
        create: productInfo,
    });

    // ahora manejas variantes aparte
    for (const v of variants)
    {
        await prisma.productVariant.upsert({
            where: {
                product_id_presentation: {
                    product_id: product.product_id,
                    presentation: v.presentation,
                },
            },
            update: {
                price: v.price,
                min_stock_level: v.min_stock_level,
                unit: v.unit,
            },
            create: {
                ...v,
                product_id: product.product_id,
            },
        });
    }
}

    //   console.log(
    //     `  → ${totalProducts} products and ${totalVariants} variants seeded.\n`
    //   );
}
