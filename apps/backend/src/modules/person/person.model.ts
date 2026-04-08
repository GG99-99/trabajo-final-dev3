import prisma from "#prisma"
import { PersonType } from "@prisma/index.js"
import { PersonForCreate } from "@final/shared"
import { PersonFilters } from "./person.interface.js"

export const personModel = {
    get: async (filters: PersonFilters) => {
        return await prisma.person.findFirst({
            where: {
                ...(filters.person_id && { person_id: filters.person_id }),
                ...(filters.email && { email: filters.email }),
            },
            ...(filters.noPass && { omit: { password: true } })
        })
    },
    
    create: async (personData: PersonForCreate) => {
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