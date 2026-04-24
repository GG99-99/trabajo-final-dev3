import prisma from '@final/db';
export const authModel = {
    getCashierByPersonId: async (person_id) => {
        return prisma.cashier.findUnique({
            where: { person_id },
            select: { cashier_id: true, person_id: true },
        });
    },
};
//# sourceMappingURL=auth.model.js.map