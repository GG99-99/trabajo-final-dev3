import { Request, Response } from "express";
import { NoAssistCreateData, GetNoAssistFilters } from "@final/shared";
import { noAssistService } from "./noAssist.service.js";
import { parseBoolean, parseNumber } from "../common/controller.utils.js";

export const noAssistController = {
  getMany: async (req: Request, res: Response) => {
    const filters: GetNoAssistFilters = {
      attendance_id: parseNumber(req.query.attendance_id),
      worker_id: parseNumber(req.query.worker_id),
      is_deleted: parseBoolean(req.query.is_deleted),
    };
    const noAssists = await noAssistService.getMany(filters);
    return res.json({ ok: true, data: noAssists, error: null });
  },

  get: async (req: Request, res: Response) => {
    const filters: GetNoAssistFilters = {
      attendance_id: parseNumber(req.query.attendance_id),
      worker_id: parseNumber(req.query.worker_id),
      is_deleted: parseBoolean(req.query.is_deleted),
    };
    const noAssist = await noAssistService.get(filters);
    return res.json({ ok: true, data: noAssist, error: null });
  },

  create: async (req: Request, res: Response) => {
    const payload: NoAssistCreateData = req.body;
    const noAssist = await noAssistService.create(payload);
    return res.json({ ok: true, data: noAssist, error: null });
  },
};
