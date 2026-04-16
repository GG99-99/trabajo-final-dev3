import { Request, Response } from "express";
import { CreatePerson, CashierWithPerson } from "@final/shared";
import { cashierService } from "./cashier.service.js";
import { parseNumber } from "../common/controller.utils.js";

export const cashierController = {
  getMany: async (req: Request, res: Response) => {
    const cashiers = await cashierService.getMany();
    return res.json({ ok: true, data: cashiers, error: null });
  },

  get: async (req: Request, res: Response) => {
    const cashier_id = parseNumber(req.query.cashier_id);
    const cashier = await cashierService.get(Number(cashier_id));
    return res.json({ ok: true, data: cashier, error: null });
  },

  create: async (req: Request, res: Response) => {
    const payload: CreatePerson = req.body;
    const cashier = await cashierService.create(payload);
    return res.json({ ok: true, data: cashier, error: null });
  },
};
