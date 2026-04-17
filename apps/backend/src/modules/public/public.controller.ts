import { Request, Response } from 'express'
import { appointmentService } from '../appointment/appointment.service.js'
import { clientService } from '../client/client.service.js'
import { personService } from '../person/person.service.js'
import { tattooService } from '../tattoo/tattoo.service.js'
import { workerService } from '../worker/worker.service.js'
import { registerBooking } from '../../middlewares/rateLimit.middleware.js'

export const publicController = {
  /** GET /api/public/tattoos */
  getTattoos: async (_req: Request, res: Response) => {
    const tattoos = await tattooService.getMany()
    return res.json({ ok: true, data: tattoos, error: null })
  },

  /** GET /api/public/workers */
  getWorkers: async (_req: Request, res: Response) => {
    const workers = await workerService.getMany()
    return res.json({ ok: true, data: workers, error: null })
  },

  /** GET /api/public/blocks?worker_id=&date= */
  getBlocks: async (req: Request, res: Response) => {
    const worker_id  = Number(req.query.worker_id)
    const dateString = String(req.query.date)
    const blocks     = await appointmentService.getBlocks({
      worker_id,
      date: new Date(dateString + 'T12:00:00.000Z'),
    })
    return res.json({ ok: true, data: blocks, error: null })
  },

  /** POST /api/public/book — rate-limited + IP daily guard */
  book: async (req: Request, res: Response) => {
    const { email, first_name, last_name, medical_notes, worker_id, tattoo_id, date, start, end } = req.body
    const ip = req.ip ?? 'unknown'

    // Validate required fields
    if (!email || !first_name || !last_name || !worker_id || !tattoo_id || !date || !start || !end) {
      return res.status(400).json({
        ok: false, data: null,
        error: { name: 'BadRequest', statusCode: 400, message: 'Missing required fields.' }
      })
    }

    const dateStr = typeof date === 'string'
      ? date.slice(0, 10)
      : new Date(date).toISOString().slice(0, 10)

    // Check if this email already has an appointment on this date
    const person = await personService.get({ email, noPass: true })
    if (person?.type === 'client') {
      const clients = await clientService.getMany()
      const existingClient = clients.find(c => c.email === email)
      if (existingClient) {
        const existing = await appointmentService.getMany({
          client_id: existingClient.client_id,
          date: new Date(dateStr + 'T12:00:00.000Z'),
        })
        if (existing.length > 0) {
          return res.status(409).json({
            ok: false, data: null,
            error: {
              name: 'DuplicateBooking',
              statusCode: 409,
              message: 'This email already has an appointment on this date.'
            }
          })
        }
      }
    }

    // Resolve or create client
    let client_id: number
    if (person?.type === 'client') {
      const clients = await clientService.getMany()
      client_id = clients.find(c => c.email === email)!.client_id
    } else {
      await clientService.create({
        first_name, last_name, email,
        password: '', type: 'client',
        medical_notes: medical_notes || undefined,
      })
      const clients = await clientService.getMany()
      client_id = clients.find(c => c.email === email)!.client_id
    }

    // Create appointment
    const appointment = await appointmentService.create({
      worker_id: Number(worker_id),
      client_id,
      tattoo_id: Number(tattoo_id),
      start, end,
      date: new Date(dateStr + 'T12:00:00.000Z'),
    })

    if (!appointment) {
      return res.status(409).json({
        ok: false, data: null,
        error: { name: 'SlotUnavailable', statusCode: 409, message: 'The selected slot is no longer available.' }
      })
    }

    // Register this IP as having booked today
    registerBooking(ip)

    return res.json({ ok: true, data: appointment, error: null })
  },
}
