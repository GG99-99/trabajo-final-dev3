import { Request, Response } from "express";
import { CreateProvider, GetProvider } from "@final/shared";
import { providerSerice } from "./provider.service.js";
import { parseNumber, parseString } from "../common/controller.utils.js";

export const providerController = {
  getMany: async (_req: Request, res: Response) => {
    const providers = await providerSerice.getMany();
    return res.json({ ok: true, data: providers, error: null });
  },

  get: async (req: Request, res: Response) => {
    const filters: GetProvider = {
      provider_id: Number(req.query.provider_id),
    };
    const provider = await providerSerice.get(filters);
    return res.json({ ok: true, data: provider, error: null });
  },

  create: async (req: Request, res: Response) => {
    const payload: CreateProvider = req.body;
    const provider = await providerSerice.create(payload);
    return res.json({ ok: true, data: provider, error: null });
  },
};
