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
                is_deleted: false,
            },
            ...(filters.noPass && { omit: { password: true } })
        })
    },

    getDeleted: async (email: string) => {
        return await prisma.person.findFirst({
            where: { email, is_deleted: true }
        })
    },

    getMany: async () => {
        return await prisma.person.findMany({
            where: { is_deleted: false },
            omit: { password: true },
            include: { cashier: true, client: true, worker: true }
        })
    },

    softDelete: async (person_id: number) => {
        return await prisma.person.update({
            where: { person_id },
            data: { is_deleted: true }
        })
    },

    restore: async (person_id: number, data: Partial<CreatePerson>) => {
        const { type, specialty, medical_notes, password, ...personInfo } = data
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