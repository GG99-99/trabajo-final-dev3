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

    update: async (person_id: number, data: {
        first_name?: string
        last_name?: string
        email?: string
        password?: string
        specialty?: string
        medical_notes?: string
    }) => {
        const { specialty, medical_notes, ...personFields } = data
        return await prisma.person.update({
            where: { person_id },
            data: {
                ...personFields,
                ...(specialty && {
                    worker: { update: { specialty: specialty as any } }
                }),
                ...(medical_notes !== undefined && {
                    client: { update: { medical_notes } }
                }),
            },
            include: { worker: true, client: true, cashier: true },
            omit: { password: true },
        })
    },

    ban: async (person_id: number, is_deleted: boolean) => {
        return await prisma.person.update({
            where: { person_id },
            data: { is_deleted },
        })
    },

    restore: async (person_id: number, data: Partial<CreatePerson>) => {
        const { type, specialty, medical_notes, password, token: _token, ...personInfo } = data
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
        const { type, specialty, medical_notes, token: _token, ...personInfo } = personData

        
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