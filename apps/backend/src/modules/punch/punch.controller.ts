import { Request, Response } from "express"
import { punchService } from "./punch.service.js"

export const punchController = {
    clockIn: async (req: Request, res: Response) => {
        try {
            const worker_id = Number(req.body.worker_id)
            if (!worker_id || isNaN(worker_id)) {
                return res.status(400).json({ ok: false, data: null, error: { message: 'worker_id inválido.' } })
            }
            const result = await punchService.clockIn(worker_id)
            return res.json({ ok: true, data: result, error: null })
        } catch (err: any) {
            const status = err.statusCode ?? 500
            return res.status(status).json({ ok: false, data: null, error: { message: err.message ?? 'Error registrando entrada.' } })
        }
    },

    clockOut: async (req: Request, res: Response) => {
        try {
            const worker_id = Number(req.body.worker_id)
            if (!worker_id || isNaN(worker_id)) {
                return res.status(400).json({ ok: false, data: null, error: { message: 'worker_id inválido.' } })
            }
            const result = await punchService.clockOut(worker_id)
            return res.json({ ok: true, data: result, error: null })
        } catch (err: any) {
            const status = err.statusCode ?? 500
            return res.status(status).json({ ok: false, data: null, error: { message: err.message ?? 'Error registrando salida.' } })
        }
    },

    getTodayStatus: async (req: Request, res: Response) => {
        try {
            const worker_id = Number(req.query.worker_id)
            const result = await punchService.getTodayStatus(worker_id)
            return res.json({ ok: true, data: result, error: null })
        } catch (err: any) {
            return res.status(500).json({ ok: false, data: null, error: { message: err.message } })
        }
    },

    getHistory: async (req: Request, res: Response) => {
        try {
            const worker_id = req.query.worker_id ? Number(req.query.worker_id) : undefined
            const date      = req.query.date ? String(req.query.date) : undefined
            const result = await punchService.getHistory({ worker_id, date })
            return res.json({ ok: true, data: result, error: null })
        } catch (err: any) {
            return res.status(500).json({ ok: false, data: null, error: { message: err.message } })
        }
    },
}
