import prisma from "@final/db";
export const personModel = {
    get: async (filters) => {
        return await prisma.person.findFirst({
            where: {
                ...(filters.person_id && { person_id: filters.person_id }),
                ...(filters.email && { email: filters.email }),
                is_deleted: false,
            },
            ...(filters.noPass && { omit: { password: true } })
        });
    },
    getDeleted: async (email) => {
        return await prisma.person.findFirst({
            where: { email, is_deleted: true }
        });
    },
    getMany: async () => {
        return await prisma.person.findMany({
            where: { is_deleted: false },
            omit: { password: true },
            include: { cashier: true, client: true, worker: true }
        });
    },
    softDelete: async (person_id) => {
        return await prisma.person.update({
            where: { person_id },
            data: { is_deleted: true }
        });
    },
    update: async (person_id, data) => {
        const { specialty, medical_notes, ...personFields } = data;
        return await prisma.person.update({
            where: { person_id },
            data: {
                ...personFields,
                ...(specialty && {
                    worker: { update: { specialty: specialty } }
                }),
                ...(medical_notes !== undefined && {
                    client: { update: { medical_notes } }
                }),
            },
            include: { worker: true, client: true, cashier: true },
            omit: { password: true },
        });
    },
    ban: async (person_id, is_deleted) => {
        return await prisma.person.update({
            where: { person_id },
            data: { is_deleted },
        });
    },
    restore: async (person_id, data) => {
        const { type, specialty, medical_notes, password, token: _token, ...personInfo } = data;
        return await prisma.person.update({
            where: { person_id },
            data: {
                ...personInfo,
                is_deleted: false,
                ...(password && { password }),
                ...(medical_notes !== undefined && {
                    client: { update: { medical_notes } }
                }),
            },
            include: { client: true }
        });
    },
    create: async (personData) => {
        // -- la password viene hasehada del servicio --
        const { type, specialty, medical_notes, token: _token, ...personInfo } = personData;
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