import { Request, Response } from "express";
import { appointmentService } from "./appointment.service.js";
import { AppointmentStatus } from "../../generated/prisma/index.js";

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
    const worker_id = Number(req.query.worker_id);
    const date      = new Date(String(req.query.date));
    const blocks    = await appointmentService.getBlocks(date, worker_id);
    return res.json({ ok: true, data: blocks, error: null });
  },

  create: async (req: Request, res: Response) => {
    const data = { ...req.body, date: new Date(req.body.date) };
    const appointment = await appointmentService.create(data);
    return res.json({ ok: true, data: appointment, error: null });
  },

  updateStatus: async (req: Request, res: Response) => {
    const appointment_id = Number(req.body.appointment_id ?? req.query.appointment_id);
    const status = (req.body.status ?? req.query.status) as AppointmentStatus;
    const result = await appointmentService.updateStatus(appointment_id, status);
    return res.json({ ok: true, data: result, error: null });
  },
};
