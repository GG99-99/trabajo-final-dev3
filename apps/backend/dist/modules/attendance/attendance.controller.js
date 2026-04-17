import { attendanceService } from "./attendance.service.js";
import { parseBoolean, parseDate, parseNumber, parseString } from "../common/controller.utils.js";
export const attendanceController = {
    getMany: async (req, res) => {
        const filters = {
            attendance_id: parseNumber(req.query.attendance_id),
            work_date: parseDate(req.query.work_date),
            status: parseBoolean(req.query.status),
            day: parseString(req.query.day),
            is_deleted: parseBoolean(req.query.is_deleted),
        };
        const attendances = await attendanceService.getMany(filters);
        return res.json({ ok: true, data: attendances, error: null });
    },
    get: async (req, res) => {
        const filters = {
            attendance_id: parseNumber(req.query.attendance_id),
            work_date: parseDate(req.query.work_date),
            status: parseBoolean(req.query.status),
            day: parseString(req.query.day),
            is_deleted: parseBoolean(req.query.is_deleted),
        };
        const attendance = await attendanceService.get(filters);
        return res.json({ ok: true, data: attendance, error: null });
    },
    create: async (req, res) => {
        const payload = req.body;
        const attendance = await attendanceService.create(payload);
        return res.json({ ok: true, data: attendance, error: null });
    },
};
//# sourceMappingURL=attendance.controller.js.map