import prisma from "@final/db";
import { WorkerWithPerson } from "@final/shared";


export const workerModel = {
    get: async (worker_id: number) => {
        return await prisma.worker.findUnique({
            where: {worker_id: worker_id},
            include: {person: true}
        })
    },
    getMany: async (): Promise<WorkerWithPerson[]> => {
        return await prisma.worker.findMany({
            include: {person: true}
        })
    }
}