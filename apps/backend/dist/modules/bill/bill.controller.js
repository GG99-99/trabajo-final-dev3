import { billService } from "./bill.service.js";
import { parseBoolean, parseNumber, parseString, parseDate } from "../common/controller.utils.js";
export const billController = {
    getMany: async (req, res) => {
        const filters = {
            client_id: parseNumber(req.query.client_id),
            cashier_id: parseNumber(req.query.cashier_id),
            status: parseString(req.query.status),
            relations: parseBoolean(req.query.relations),
            date: parseDate(req.query.date),
        };
        const bills = await billService.getMany(filters);
        return res.json({ ok: true, data: bills, error: null });
    },
    get: async (req, res) => {
        const filters = {
            bill_id: Number(req.query.bill_id),
            relations: parseBoolean(req.query.relations),
        };
        const bill = await billService.get(filters);
        return res.json({ ok: true, data: bill, error: null });
    },
    getTotal: async (req, res) => {
        const bill_id = Number(req.query.bill_id);
        const result = await billService.getTotal(bill_id);
        return res.json({ ok: true, data: result, error: null });
    },
    getStockMovements: async (req, res) => {
        const bill_id = Number(req.query.bill_id);
        const stockMovements = await billService.getStockMovements(bill_id);
        return res.json({ ok: true, data: stockMovements, error: null });
    },
    getTattoos: async (req, res) => {
        const bill_id = Number(req.query.bill_id);
        const tattoos = await billService.getTattoos(bill_id);
        return res.json({ ok: true, data: tattoos, error: null });
    },
    create: async (req, res) => {
        const payload = req.body;
        console.log(payload);
        try {
            const bill = await billService.create(payload);
            return res.json({ ok: true, data: bill, error: null });
        }
        catch (err) {
            console.error('[bill.create ERROR]', err);
            const statusCode = err?.statusCode ?? 500;
            const message = err?.message ?? 'Error interno al crear la factura';
            return res.status(statusCode).json({ ok: false, data: null, error: message });
        }
    },
    updateState: async (req, res) => {
        const bill_id = Number(req.body.bill_id || req.query.bill_id);
        const status = req.body.status || req.query.status;
        const result = await billService.updateStateDirect({ bill_id, status });
        return res.json({ ok: true, data: result, error: null });
    },
};
//# sourceMappingURL=bill.controller.js.map