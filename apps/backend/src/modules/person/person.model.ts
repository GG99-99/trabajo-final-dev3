import prisma from "#prisma"
import { PersonType } from "@prisma/index.js"
import { PersonForCreate } from "@final/shared"

export const personModel = {
    getPersonByEmail: async (email: string) => {
        return await prisma.person.findUnique({
            where: {email: email}
        })
    },
    createPerson: async (personData: PersonForCreate) => {
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