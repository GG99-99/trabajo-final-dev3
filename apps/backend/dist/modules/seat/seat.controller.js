import { seatService } from "./seat.service.js";
import { parseBoolean, parseNumber, parseString } from "../common/controller.utils.js";
export const seatController = {
    getMany: async (req, res) => {
        const filters = {
            seat_id: parseNumber(req.query.seat_id),
            seat_code: parseString(req.query.seat_code),
            is_deleted: parseBoolean(req.query.is_deleted),
        };
        const seats = await seatService.getMany(filters);
        return res.json({ ok: true, data: seats, error: null });
    },
    get: async (req, res) => {
        const filters = {
            seat_id: parseNumber(req.query.seat_id),
            seat_code: parseString(req.query.seat_code),
            is_deleted: parseBoolean(req.query.is_deleted),
        };
        const seat = await seatService.get(filters);
        return res.json({ ok: true, data: seat, error: null });
    },
    /***********
    |   CREATE  |
     ***********/
    create: async (req, res) => {
        const data = req.body;
        const seat = await seatService.create(data);
        return res.json({ ok: true, data: seat, error: null });
    }
};
//# sourceMappingURL=seat.controller.js.map