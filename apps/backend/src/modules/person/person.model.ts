import prisma from "@final/db"
import { PersonType } from "@final/db"
import { CreatePerson } from "@final/shared"
import { GetPerson } from "@final/shared"

export const personModel = {
    get: async (filters: GetPerson) => {
        return await prisma.person.findFirst({
            where: {
                ...(filters.person_id && { person_id: filters.person_id }),
                ...(filters.email && { email: filters.email }),
            },
            ...(filters.noPass && { omit: { password: true } })
        })
    },

    getMany: async () => {
        return await prisma.person.findMany({
            omit: { password: true },
            include: {
                cashier: true,
                client: true,
                worker: true
            }
        })
    },
    
    create: async (personData: CreatePerson) => {
        // -- la password viene hasehada del servicio --
        const { type, specialty, medical_notes, ...personInfo } = personData

        
        const newPerson = await prisma.person.create({
            data: {
            ...personInfo,
            type: type as PersonType,

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
        })

        return newPerson

    },
}