import { Request, Response } from "express";
import { CreateFullBill, GetBill, GetManyBill, UpdateBillStatus } from "@final/shared";
import { billService } from "./bill.service.js";
import { parseBoolean, parseNumber, parseString, parseDate } from "../common/controller.utils.js";
import { BillStatus } from "@final/db";

export const billController = {
  getMany: async (req: Request, res: Response) => {
    const filters: GetManyBill = {
      client_id: parseNumber(req.query.client_id),
      cashier_id: parseNumber(req.query.cashier_id),
      status: parseString(req.query.status) as BillStatus,
      relations: parseBoolean(req.query.relations),
      date: parseDate(req.query.date),
    };
    const bills = await billService.getMany(filters);
    return res.json({ ok: true, data: bills, error: null });
  },

  get: async (req: Request, res: Response) => {
    const filters: GetBill = {
      bill_id: Number(req.query.bill_id),
      relations: parseBoolean(req.query.relations),
    };
    const bill = await billService.get(filters);
    return res.json({ ok: true, data: bill, error: null });
  },

  getTotal: async (req: Request, res: Response) => {
    const bill_id = Number(req.query.bill_id);
    const result = await billService.getTotal(bill_id);
    return res.json({ ok: true, data: result, error: null });
  },

  getStockMovements: async (req: Request, res: Response) => {
    const bill_id = Number(req.query.bill_id);
    const stockMovements = await billService.getStockMovements(bill_id);
    return res.json({ ok: true, data: stockMovements, error: null });
  },

  getTattoos: async (req: Request, res: Response) => {
    const bill_id = Number(req.query.bill_id);
    const tattoos = await billService.getTattoos(bill_id);
    return res.json({ ok: true, data: tattoos, error: null });
  },

  create: async (req: Request, res: Response) => {
    const payload: CreateFullBill = req.body;
    console.log(payload)
    const bill = await billService.create(payload);
    return res.json({ ok: true, data: bill, error: null });
  },

  updateState: async (req: Request, res: Response) => {
    const bill_id = Number(req.body.bill_id || req.query.bill_id);
    const status = req.body.status || req.query.status;
    const result = await billService.updateStateDirect({ bill_id, status });
    return res.json({ ok: true, data: result, error: null });
  },
};
