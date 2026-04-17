import prisma from "@final/db";
// 1. Crear imágenes dummy
const imgs = await Promise.all([
    prisma.img.create({
        data: {
            source: Buffer.from("tattoo1"),
            description: "Diseño realista",
        },
    }),
    prisma.img.create({
        data: {
            source: Buffer.from("tattoo2"),
            description: "Diseño cartoon",
        },
    }),
    prisma.img.create({
        data: {
            source: Buffer.from("tattoo3"),
            description: "Diseño minimalista",
        },
    }),
]);
// 2. Crear tattoos
const tattoos = [
    {
        tattoo_id: 1,
        img_id: imgs[0].img_id,
        name: "León Realista",
        cost: 150.00,
        time: "03:00", // 3 horas
    },
    {
        tattoo_id: 2,
        img_id: imgs[1].img_id,
        name: "Dragón Cartoon",
        cost: 100.50,
        time: "02:00", // 2 horas
    },
    {
        tattoo_id: 3,
        img_id: imgs[2].img_id,
        name: "Símbolo Minimalista",
        cost: 50.75,
        time: "01:00", // 1 hora
    },
];
export async function seedTattoos() {
    for (const t of tattoos) {
        await prisma.tattoo.upsert({
            where: { tattoo_id: t.tattoo_id },
            update: {},
            create: { ...t },
        });
    }
}
//# sourceMappingURL=seed.tattoo.js.map