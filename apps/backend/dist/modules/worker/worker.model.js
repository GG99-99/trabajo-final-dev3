import prisma from "@final/db";
export const workerModel = {
    get: async (worker_id) => {
        return await prisma.worker.findUnique({
            where: { worker_id: worker_id },
            include: { person: true }
        });
    },
    getMany: async () => {
        return await prisma.worker.findMany({
            include: { person: true }
        });
    }
};
//# sourceMappingURL=worker.model.js.map