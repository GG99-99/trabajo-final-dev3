import prisma from "@final/db"
import { ApiErr } from "@final/shared"

export const fingerprintService = {

    getByWorker: async (worker_id: number) => {
        return await prisma.fingerprint.findUnique({ where: { worker_id } })
    },

    upsert: async (worker_id: number, template: string, finger_index: number) => {
        return await prisma.fingerprint.upsert({
            where: { worker_id },
            update: { template, finger_index, updated_at: new Date() },
            create: { worker_id, template, finger_index }
        })
    },

    delete: async (worker_id: number) => {
        const existing = await prisma.fingerprint.findUnique({ where: { worker_id } })
        if (!existing) throw { statusCode: 404, name: 'NotFound', message: 'No fingerprint registered.' } as ApiErr
        return await prisma.fingerprint.delete({ where: { worker_id } })
    },

    /** Verify a template against stored one — comparison done by .NET service */
    getAll: async () => {
        return await prisma.fingerprint.findMany({
            include: { worker: { include: { person: true } } }
        })
    },

    /** Workers without fingerprint registered */
    getWorkersWithoutFingerprint: async () => {
        return await prisma.worker.findMany({
            where: { fingerprint: null },
            include: { person: true }
        })
    }
}
