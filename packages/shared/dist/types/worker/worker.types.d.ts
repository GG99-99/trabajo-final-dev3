import prisma from "@final/db";
import type { Prisma } from "@final/db";
export type WorkerWithPerson = Prisma.Result<typeof prisma.worker, {
    include: {
        person: true;
    };
}, 'findUnique'>;
export type WorkerPublic = {
    worker_id: number;
    person_id: number;
    first_name: string;
    last_name: string;
    email: string;
    type: string;
    specialty: string;
};
//# sourceMappingURL=worker.types.d.ts.map