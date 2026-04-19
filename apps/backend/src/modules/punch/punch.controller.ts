import { Request, Response } from "express"
import { punchService } from "./punch.service.js"

export const punchController = {
    clockIn: async (req: Request, res: Response) => {
        const worker_id = Number(req.body.worker_id)
        const result = await punchService.clockIn(worker_id)
        return res.json({ ok: true, data: result, error: null })
    },

    clockOut: async (req: Request, res: Response) => {
        const worker_id = Number(req.body.worker_id)
        const result = await punchService.clockOut(worker_id)
        return res.json({ ok: true, data: result, error: null })
    },

    getTodayStatus: async (req: Request, res: Response) => {
        const worker_id = Number(req.query.worker_id)
        const result = await punchService.getTodayStatus(worker_id)
        return res.json({ ok: true, data: result, error: null })
    },

    getHistory: async (req: Request, res: Response) => {
        const worker_id = req.query.worker_id ? Number(req.query.worker_id) : undefined
        const date      = req.query.date ? String(req.query.date) : undefined
        const result = await punchService.getHistory({ worker_id, date })
        return res.json({ ok: true, data: result, error: null })
    },
}
