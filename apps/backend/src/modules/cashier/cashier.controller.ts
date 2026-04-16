import { Request, Response } from 'express'
import { cashierService } from './cashier.service.js'
import { ApiResponse, CashierPublic } from '@final/shared'

export const cashierController = {
  getAll: async (req: Request, res: Response) => {
    const cashiers = await cashierService.getAll()
    const response: ApiResponse<CashierPublic[]> = { ok: true, data: cashiers, error: null }
    return res.json(response)
  },

  getOne: async (req: Request, res: Response) => {
    const cashier_id = Number(req.query.cashier_id)
    const cashier = await cashierService.get(cashier_id)
    const response: ApiResponse<typeof cashier> = { ok: true, data: cashier, error: null }
    return res.json(response)
  },

  create: async (req: Request, res: Response) => {
    const cashier = await cashierService.create(req.body)
    const response: ApiResponse<typeof cashier> = { ok: true, data: cashier, error: null }
    return res.json(response)
  },
}
