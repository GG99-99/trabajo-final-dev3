import { assistService } from "./assist.service.js";
import { parseBoolean, parseNumber } from "../common/controller.utils.js";
export const assistController = {
    getMany: async (req, res) => {
        const filters = {
            worker_id: parseNumber(req.query.worker_id),
            attendance_id: parseNumber(req.query.attendance_id),
            alert: parseBoolean(req.query.alert),
            is_deleted: parseBoolean(req.query.is_deleted),
        };
        const assists = await assistService.getMany(filters);
        return res.json({ ok: true, data: assists, error: null });
    },
    get: async (req, res) => {
        const filters = {
            worker_id: parseNumber(req.query.worker_id),
            attendance_id: parseNumber(req.query.attendance_id),
            alert: parseBoolean(req.query.alert),
            is_deleted: parseBoolean(req.query.is_deleted),
        };
        const assist = await assistService.get(filters);
        return res.json({ ok: true, data: assist, error: null });
    },
    create: async (req, res) => {
        const payload = req.body;
        const assist = await assistService.create(payload);
        return res.json({ ok: true, data: assist, error: null });
    },
};
//# sourceMappingURL=assist.controller.js.map