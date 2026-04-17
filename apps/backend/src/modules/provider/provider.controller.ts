import { Request, Response } from "express";
import { CreateProvider, GetProvider } from "@final/shared";
import { providerService } from "./provider.service.js";
import { parseNumber, parseString } from "../common/controller.utils.js";

export const providerController = {
  getMany: async (_req: Request, res: Response) => {
    const providers = await providerService.getMany();
    return res.json({ ok: true, data: providers, error: null });
  },

  get: async (req: Request, res: Response) => {
    const filters: GetProvider = {
      provider_id: Number(req.query.provider_id),
    };
    const provider = await providerService.get(filters);
    return res.json({ ok: true, data: provider, error: null });
  },

  create: async (req: Request, res: Response) => {
    const payload: CreateProvider = req.body;
    const provider = await providerService.create(payload);
    return res.json({ ok: true, data: provider, error: null });
  },
};
