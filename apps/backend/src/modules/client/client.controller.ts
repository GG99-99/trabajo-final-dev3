import { Request, Response } from "express";
import { ClientCreate, ClientWithRelations } from "@final/shared";
import { clientService } from "./client.service.js";
import { parseNumber } from "../common/controller.utils.js";

export const clientController = {
  getMany: async (_req: Request, res: Response) => {
    const clients = await clientService.getMany();
    return res.json({ ok: true, data: clients, error: null });
  },

  get: async (req: Request, res: Response) => {
    const client_id = parseNumber(req.query.client_id);
    const client = await clientService.get(Number(client_id));
    return res.json({ ok: true, data: client, error: null });
  },

  create: async (req: Request, res: Response) => {
    const payload: ClientCreate = req.body;
    const client = await clientService.create(payload);
    return res.json({ ok: true, data: client, error: null });
  },
};
