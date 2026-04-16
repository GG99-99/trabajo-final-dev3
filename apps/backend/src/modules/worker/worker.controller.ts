import { Request, Response } from 'express'
import { workerService } from './worker.service.js'
import { ApiResponse, WorkerPublic } from '@final/shared'

export const workerController = {
  getAll: async (req: Request, res: Response) => {
    const workers = await workerService.getAll()
    const response: ApiResponse<WorkerPublic[]> = { ok: true, data: workers, error: null }
    return res.json(response)
  },

  getOne: async (req: Request, res: Response) => {
    const worker_id = Number(req.query.worker_id)
    const worker = await workerService.get(worker_id)
    const response: ApiResponse<typeof worker> = { ok: true, data: worker, error: null }
    return res.json(response)
  },
}
