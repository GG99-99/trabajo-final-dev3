import prisma from "@final/db";
import bcrypt from "bcrypt";
const SALT_ROUNDS = 10;
export async function seedPerson(data) {
    for (const personData of data) {
        const { type, specialty, medical_notes, password, ...personInfo } = personData;
        // Hash password
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        await prisma.person.upsert({
            where: { email: personInfo.email },
            update: {},
            create: {
                ...personInfo,
                password: hashedPassword,
                type: type,
                ...(type === "client" && {
                    client: { create: { medical_notes: medical_notes ?? "" } },
                }),
                ...(type === "worker" && {
                    worker: { create: { specialty: specialty || "other" } },
                }),
                ...(type === "cashier" && {
                    cashier: { create: {} },
                }),
            },
        });
    }
}
//# sourceMappingURL=seedPersons.js.map