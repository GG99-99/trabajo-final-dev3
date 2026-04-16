import { Request, Response } from "express";
import { CreateSchedule, ScheduleDayOfWeek, GetManySchedules } from "@final/shared";
import { scheduleService } from "./schedule.service.js";
import { parseBoolean, parseNumber, parseString } from "../common/controller.utils.js";

export const scheduleController = {
  getMany: async (req: Request, res: Response) => {
    const filters: GetManySchedules = {
      worker_id: parseNumber(req.query.worker_id),
      seat_id: parseNumber(req.query.seat_id),
      active: parseBoolean(req.query.active),
    };
    const schedules = await scheduleService.getMany(filters);
    return res.json({ ok: true, data: schedules, error: null });
  },

  getActive: async (req: Request, res: Response) => {
    const worker_id = Number(req.query.worker_id);
    const schedule = await scheduleService.getActive(worker_id);
    return res.json({ ok: true, data: schedule, error: null });
  },

  getDayByWorker: async (req: Request, res: Response) => {
    const worker_id = Number(req.query.worker_id);
    const day = req.query.day as ScheduleDayOfWeek;
    const schedule = await scheduleService.getDayByWorker(worker_id, day);
    return res.json({ ok: true, data: schedule, error: null });
  },

  create: async (req: Request, res: Response) => {
    const payload: CreateSchedule = req.body;
    const schedule = await scheduleService.create(payload);
    return res.json({ ok: true, data: schedule, error: null });
  },

  inactive: async (req: Request, res: Response) => {
    const schedule_id = Number(req.body.schedule_id || req.query.schedule_id);
    const schedule = await scheduleService.inactive(schedule_id);
    return res.json({ ok: true, data: schedule, error: null });
  },
};
