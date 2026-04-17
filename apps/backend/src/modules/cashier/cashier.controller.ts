import { Request, Response } from "express";
import { cashierService } from "./cashier.service.js";

export const cashierController = {
  getMany: async (_req: Request, res: Response) => {
    const cashiers = await cashierService.getAll();
    return res.json({ ok: true, data: cashiers, error: null });
  },

  get: async (req: Request, res: Response) => {
    const cashier_id = Number(req.query.cashier_id);
    const cashier = await cashierService.get(cashier_id);
    return res.json({ ok: true, data: cashier, error: null });
  },

  create: async (req: Request, res: Response) => {
    const cashier = await cashierService.create(req.body);
    return res.json({ ok: true, data: cashier, error: null });
  },
};
