import { Request, Response } from "express";
import { clientService } from "./client.service.js";
import { personService } from "../person/person.service.js";

export const clientController = {
  getMany: async (_req: Request, res: Response) => {
    const clients = await clientService.getMany();
    return res.json({ ok: true, data: clients, error: null });
  },

  get: async (req: Request, res: Response) => {
    const client_id = Number(req.query.client_id);
    const client = await clientService.get(client_id);
    return res.json({ ok: true, data: client, error: null });
  },

  getByEmail: async (req: Request, res: Response) => {
    const email = String(req.query.email || '');
    if (!email) {
      return res.status(400).json({ ok: false, data: null, error: { name: 'BadRequest', statusCode: 400, message: 'email required' } });
    }
    const client = await clientService.getByEmail(email);
    return res.json({ ok: true, data: client, error: null });
  },

  create: async (req: Request, res: Response) => {
    const client = await clientService.create(req.body);
    return res.json({ ok: true, data: client, error: null });
  },

  softDelete: async (req: Request, res: Response) => {
    const client_id = Number(req.params.id ?? req.query.client_id);
    const client = await clientService.get(client_id);
    if (!client) {
      return res.status(404).json({ ok: false, data: null, error: { name: 'NotFound', statusCode: 404, message: 'Client not found' } });
    }
    await personService.softDelete(client.person_id!);
    return res.json({ ok: true, data: true, error: null });
  },
};
