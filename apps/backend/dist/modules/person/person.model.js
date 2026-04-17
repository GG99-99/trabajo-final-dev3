import prisma from "@final/db";
export const personModel = {
    get: async (filters) => {
        return await prisma.person.findFirst({
            where: {
                ...(filters.person_id && { person_id: filters.person_id }),
                ...(filters.email && { email: filters.email }),
            },
            ...(filters.noPass && { omit: { password: true } })
        });
    },
    getMany: async () => {
        return await prisma.person.findMany({
            omit: { password: true },
            include: {
                cashier: true,
                client: true,
                worker: true
            }
        });
    },
    create: async (personData) => {
        // -- la password viene hasehada del servicio --
        const { type, specialty, medical_notes, ...personInfo } = personData;
        const newPerson = await prisma.person.create({
            data: {
                ...personInfo,
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
        return newPerson;
    },
};
//# sourceMappingURL=person.model.js.map