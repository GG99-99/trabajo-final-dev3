import { Request, Response } from "express";
import { CreateAppointment, GetAppointmentFilters, GetBlocks } from "@final/shared";
import { appointmentService } from "./appointment.service.js";
import { parseNumber, parseDate, parseString } from "../common/controller.utils.js";
import { AppointmentStatus } from "@final/db";

export const appointmentController = {
    /********
    |   GET  |
     ********/
    getMany: async (req: Request, res: Response) =>
    {
        const filters: GetAppointmentFilters = {
            appointment_id: parseNumber(req.query.appointment_id),
            worker_id: parseNumber(req.query.worker_id),
            client_id: parseNumber(req.query.client_id),
            tattoo_id: parseNumber(req.query.tattoo_id),
            start: parseString(req.query.start),
            end: parseString(req.query.end),
            date: parseDate(req.query.date),
            status: parseString(req.query.status) as AppointmentStatus,
        };
        const appointments = await appointmentService.getMany(filters);
        return res.json({ ok: true, data: appointments, error: null });
    },

    getBlocks: async (req: Request, res: Response) =>
    {
        const filters: GetBlocks = {
            worker_id: Number(req.query.worker_id),
            date: parseDate(req.query.date) ?? new Date(),
        };
        const blocks = await appointmentService.getBlocks(filters);
        return res.json({ ok: true, data: blocks, error: null });
    },

    /*********
    |   POST  |
     *********/
    create: async (req: Request, res: Response) =>
    {
        const payload: CreateAppointment = req.body;
        const appointment = await appointmentService.create(payload);
        return res.json({ ok: true, data: appointment, error: null });
    },

    /********
    |   PUT  |
     ********/
    updateStatus: async (req: Request, res: Response) =>
    {
        const appointment_id = Number(req.body.appointment_id || req.query.appointment_id);
        const status = req.body.status || req.query.status;
        const result = await appointmentService.updateStatusDirect(appointment_id, status);
        return res.json({ ok: true, data: result, error: null });
    },
};
