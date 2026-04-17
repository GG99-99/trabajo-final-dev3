import prisma from "@final/db";
import bcrypt from "bcrypt";
export const persons_seed = [
    {
        first_name: "Juan",
        last_name: "Perez",
        email: "juan@test.com",
        password: "",
        type: "client",
        medical_notes: "Piel sensible",
    },
    {
        first_name: "Ana",
        last_name: "Gomez",
        email: "ana@test.com",
        password: "123456",
        type: "worker",
        specialty: "realism",
    },
    {
        first_name: "Jeremy",
        last_name: "Garcia",
        email: "j@test.com",
        password: "123456",
        type: "worker",
        specialty: "realism",
    },
    {
        first_name: "Luis",
        last_name: "Martinez",
        email: "luis@test.com",
        password: "123456",
        type: "cashier",
    },
];
const SALT_ROUNDS = 10;
export async function seedPerson() {
    for (const personData of persons_seed) {
        const { type, specialty, medical_notes, password, ...personInfo } = personData;
        const hashedPassword = await bcrypt.hash(password || "default_pass", SALT_ROUNDS);
        // 1. Creamos la base del objeto 'create'
        const createData = {
            ...personInfo,
            password: hashedPassword,
            type: type,
        };
        // 2. Añadimos la relación específica según el tipo
        if (type === "client") {
            createData.client = { create: { medical_notes: medical_notes ?? "" } };
        }
        else if (type === "worker") {
            createData.worker = { create: { specialty: specialty || "other" } };
        }
        else if (type === "cashier") {
            createData.cashier = { create: {} };
        }
        await prisma.person.upsert({
            where: { email: personInfo.email },
            update: {},
            create: createData, // Ahora el objeto está bien definido
        });
    }
}
//# sourceMappingURL=seed.persons.js.map