import { Request, Response } from "express";
import { appointmentService } from "./appointment.service.js";
import { AppointmentStatus } from "@final/db";

export const appointmentController = {
  getMany: async (req: Request, res: Response) => {
    const filters = {
      appointment_id: req.query.appointment_id ? Number(req.query.appointment_id) : undefined,
      worker_id:      req.query.worker_id      ? Number(req.query.worker_id)      : undefined,
      client_id:      req.query.client_id      ? Number(req.query.client_id)      : undefined,
      tattoo_id:      req.query.tattoo_id      ? Number(req.query.tattoo_id)      : undefined,
      start:          req.query.start          ? String(req.query.start)          : undefined,
      end:            req.query.end            ? String(req.query.end)            : undefined,
      date:           req.query.date           ? new Date(String(req.query.date)) : undefined,
      status:         req.query.status         ? req.query.status as AppointmentStatus : undefined,
    };
    const appointments = await appointmentService.getMany(filters);
    return res.json({ ok: true, data: appointments, error: null });
  },

  getBlocks: async (req: Request, res: Response) => {
    try {
      const worker_id  = Number(req.query.worker_id)
      const dateString = String(req.query.date)
      const blocks     = await appointmentService.getBlocks({
        worker_id,
        date: new Date(dateString + 'T12:00:00'),
      })
      return res.json({ ok: true, data: blocks, error: null })
    } catch (err: any) {
      console.error('[getBlocks error]', err)
      return res.status(err?.statusCode || 500).json({
        ok: false, data: null,
        error: { name: err?.name || 'Error', statusCode: err?.statusCode || 500, message: err?.message || String(err) }
      })
    }
  },

  create: async (req: Request, res: Response) => {
    const rawDate = req.body.date
    const dateStr = typeof rawDate === 'string'
      ? rawDate.slice(0, 10)
      : new Date(rawDate).toISOString().slice(0, 10)
    const data = { ...req.body, date: new Date(dateStr + 'T12:00:00.000Z') }
    const appointment = await appointmentService.create(data)
    return res.json({ ok: true, data: appointment, error: null })
  },

  updateStatus: async (req: Request, res: Response) => {
    const appointment_id = Number(req.body.appointment_id ?? req.query.appointment_id)
    const status = (req.body.status ?? req.query.status) as AppointmentStatus
    const result = await appointmentService.updateStatusDirect(appointment_id, status)
    return res.json({ ok: true, data: result, error: null })
  },
};
