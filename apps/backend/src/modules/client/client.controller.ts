import { Request, Response } from 'express'
import { clientService } from './client.service.js'
import { ApiResponse, ClientPublic } from '@final/shared'

export const clientController = {
  getAll: async (req: Request, res: Response) => {
    const clients = await clientService.getAll()
    const response: ApiResponse<ClientPublic[]> = { ok: true, data: clients, error: null }
    return res.json(response)
  },

  getOne: async (req: Request, res: Response) => {
    const client_id = Number(req.query.client_id)
    const client = await clientService.get(client_id)
    const response: ApiResponse<typeof client> = { ok: true, data: client, error: null }
    return res.json(response)
  },

  create: async (req: Request, res: Response) => {
    const client = await clientService.create(req.body)
    const response: ApiResponse<typeof client> = { ok: true, data: client, error: null }
    return res.json(response)
  },
}
