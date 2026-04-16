import { Request, Response } from "express";
import { CreateTattooRequest, GetTattoo, GetTattooMaterials } from "@final/shared";
import { tattooService } from "./tattoo.service.js";
import { parseNumber, parseString } from "../common/controller.utils.js";

export const tattooController = {
  get: async (req: Request, res: Response) => {
    const filters: GetTattoo = {
      tattoo_id: Number(req.query.tattoo_id),
    };
    const tattoo = await tattooService.get(filters);
    return res.json({ ok: true, data: tattoo, error: null });
  },

  getMaterials: async (req: Request, res: Response) => {
    const filters: GetTattooMaterials = {
      tattoo_id: Number(req.query.tattoo_id),
    };
    const materials = await tattooService.getMaterials(filters);
    return res.json({ ok: true, data: materials, error: null });
  },

  create: async (req: Request, res: Response) => {
    const payload: CreateTattooRequest = req.body;
    const tattoo = await tattooService.create(payload);
    return res.json({ ok: true, data: tattoo, error: null });
  },
};
