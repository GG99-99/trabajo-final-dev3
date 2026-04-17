import prisma from "@final/db";

export async function seedSeats() {
    const seats = [
        { seat_code: "S-001" },
        { seat_code: "S-002" },
        { seat_code: "S-003" },
    ];

    for (const seat of seats) {
        await prisma.seat.upsert({
            where: {
                seat_code: seat.seat_code, // 👈 debe ser único
            },
            update: {},
            create: {
                seat_code: seat.seat_code,
            },
        });
    }

}