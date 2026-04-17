import { Request, Response } from "express";
import { CreateAttendance, GetAttendanceFilters } from "@final/shared";
import { attendanceService } from "./attendance.service.js";
import { parseBoolean, parseDate, parseNumber, parseString } from "../common/controller.utils.js";

export const attendanceController = {
  getMany: async (req: Request, res: Response) => {
    const filters: GetAttendanceFilters = {
      attendance_id: parseNumber(req.query.attendance_id),
      work_date: parseDate(req.query.work_date),
      status: parseBoolean(req.query.status),
      day: parseString(req.query.day),
      is_deleted: parseBoolean(req.query.is_deleted),
    };
    const attendances = await attendanceService.getMany(filters);
    return res.json({ ok: true, data: attendances, error: null });
  },

  get: async (req: Request, res: Response) => {
    const filters: GetAttendanceFilters = {
      attendance_id: parseNumber(req.query.attendance_id),
      work_date: parseDate(req.query.work_date),
      status: parseBoolean(req.query.status),
      day: parseString(req.query.day),
      is_deleted: parseBoolean(req.query.is_deleted),
    };
    const attendance = await attendanceService.get(filters);
    return res.json({ ok: true, data: attendance, error: null });
  },

  create: async (req: Request, res: Response) => {
    const payload: CreateAttendance = req.body;
    const attendance = await attendanceService.create(payload);
    return res.json({ ok: true, data: attendance, error: null });
  },
};
