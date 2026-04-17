import { Request, Response } from "express";
import { CreateAssist, GetAssistFilters } from "@final/shared";
import { assistService } from "./assist.service.js";
import { parseBoolean, parseNumber } from "../common/controller.utils.js";

export const assistController = {
  getMany: async (req: Request, res: Response) => {
    const filters: GetAssistFilters = {
      worker_id: parseNumber(req.query.worker_id),
      attendance_id: parseNumber(req.query.attendance_id),
      alert: parseBoolean(req.query.alert),
      is_deleted: parseBoolean(req.query.is_deleted),
    };
    const assists = await assistService.getMany(filters);
    return res.json({ ok: true, data: assists, error: null });
  },

  get: async (req: Request, res: Response) => {
    const filters: GetAssistFilters = {
      worker_id: parseNumber(req.query.worker_id),
      attendance_id: parseNumber(req.query.attendance_id),
      alert: parseBoolean(req.query.alert),
      is_deleted: parseBoolean(req.query.is_deleted),
    };
    const assist = await assistService.get(filters);
    return res.json({ ok: true, data: assist, error: null });
  },

  create: async (req: Request, res: Response) => {
    const payload: CreateAssist = req.body;
    const assist = await assistService.create(payload);
    return res.json({ ok: true, data: assist, error: null });
  },
};
