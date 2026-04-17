import { paymentService } from "./payment.service.js";
const parseBoolean = (value) => {
    if (typeof value === "string") {
        return value.toLowerCase() === "true";
    }
    return undefined;
};
const parseNumber = (value) => {
    if (typeof value === "string" && value.trim() !== "") {
        const parsed = Number(value);
        return Number.isNaN(parsed) ? undefined : parsed;
    }
    return undefined;
};
export const paymentController = {
    get: async (req, res) => {
        const filters = {
            payment_id: Number(req.query.payment_id),
            bill_id: parseNumber(req.query.bill_id),
            date: req.query.date ? new Date(String(req.query.date)) : undefined,
            relations: parseBoolean(req.query.relations),
        };
        const payment = await paymentService.get(filters);
        return res.json({ ok: true, data: payment, error: null });
    },
    getMany: async (req, res) => {
        const filters = {
            bill_id: parseNumber(req.query.bill_id),
            date: req.query.date ? new Date(String(req.query.date)) : undefined,
            relations: parseBoolean(req.query.relations),
        };
        const payments = await paymentService.getMany(filters);
        return res.json({ ok: true, data: payments, error: null });
    },
    getManyByMonth: async (req, res) => {
        const filters = {
            year: Number(req.query.year),
            month: Number(req.query.month),
        };
        const payments = await paymentService.getManyByMonth(filters);
        return res.json({ ok: true, data: payments, error: null });
    },
    create: async (req, res) => {
        const payload = req.body;
        const payment = await paymentService.create(payload);
        return res.json({ ok: true, data: payment, error: null });
    },
};
//# sourceMappingURL=payment.controller.js.map