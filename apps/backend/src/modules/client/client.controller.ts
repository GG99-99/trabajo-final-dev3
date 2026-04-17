import { Request, Response } from "express";
import { clientService } from "./client.service.js";

export const clientController = {
  getMany: async (_req: Request, res: Response) => {
    const clients = await clientService.getAll();
    return res.json({ ok: true, data: clients, error: null });
  },

  get: async (req: Request, res: Response) => {
    const client_id = Number(req.query.client_id);
    const client = await clientService.get(client_id);
    return res.json({ ok: true, data: client, error: null });
  },

  create: async (req: Request, res: Response) => {
    const client = await clientService.create(req.body);
    return res.json({ ok: true, data: client, error: null });
  },
};
