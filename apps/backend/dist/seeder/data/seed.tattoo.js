import prisma from "@final/db";
export async function seedTattoos() {
    // 1. Crear imágenes dummy (solo si no existen tattoos)
    const existing = await prisma.tattoo.count();
    if (existing >= 3)
        return;
    const imgs = await Promise.all([
        prisma.img.create({
            data: { source: Buffer.from("tattoo1"), description: "Diseño realista" },
        }),
        prisma.img.create({
            data: { source: Buffer.from("tattoo2"), description: "Diseño cartoon" },
        }),
        prisma.img.create({
            data: { source: Buffer.from("tattoo3"), description: "Diseño minimalista" },
        }),
    ]);
    // 2. Crear tattoos
    const tattoos = [
        { img_id: imgs[0].img_id, name: "León Realista", cost: 150.00, time: "03:00" },
        { img_id: imgs[1].img_id, name: "Dragón Cartoon", cost: 100.50, time: "02:00" },
        { img_id: imgs[2].img_id, name: "Símbolo Minimalista", cost: 50.75, time: "01:00" },
    ];
    for (const t of tattoos) {
        await prisma.tattoo.create({ data: t });
    }
}
//# sourceMappingURL=seed.tattoo.js.map