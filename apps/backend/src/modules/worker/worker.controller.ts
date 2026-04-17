import { Request, Response } from "express";
import { workerService } from "./worker.service.js";

export const workerController = {
  getMany: async (_req: Request, res: Response) => {
    const workers = await workerService.getAll();
    return res.json({ ok: true, data: workers, error: null });
  },

  get: async (req: Request, res: Response) => {
    const worker_id = Number(req.query.worker_id);
    const worker = await workerService.get(worker_id);
    return res.json({ ok: true, data: worker, error: null });
  },
};
