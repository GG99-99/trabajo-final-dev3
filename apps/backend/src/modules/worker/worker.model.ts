import prisma from "#prisma";


export const workerModel = {
    get: async (worker_id: number) => {
        return await prisma.worker.findUnique({
            where: {worker_id: worker_id},
            include: {person: true}
        })
    },
    getAll: async () => {
        return await prisma.worker.findMany({
            include: {person: true}
        })
    }
}