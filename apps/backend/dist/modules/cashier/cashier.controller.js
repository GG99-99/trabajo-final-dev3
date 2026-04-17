import { cashierService } from "./cashier.service.js";
export const cashierController = {
    getMany: async (_req, res) => {
        const cashiers = await cashierService.getMany();
        return res.json({ ok: true, data: cashiers, error: null });
    },
    get: async (req, res) => {
        const cashier_id = Number(req.query.cashier_id);
        const cashier = await cashierService.get(cashier_id);
        return res.json({ ok: true, data: cashier, error: null });
    },
    create: async (req, res) => {
        const cashier = await cashierService.create(req.body);
        return res.json({ ok: true, data: cashier, error: null });
    },
};
//# sourceMappingURL=cashier.controller.js.map