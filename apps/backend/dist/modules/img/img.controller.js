import { imgService } from "./img.service.js";
import { parseBoolean, parseDate, parseString } from "../common/controller.utils.js";
export const imgController = {
    getMany: async (req, res) => {
        const filters = {
            date: parseDate(req.query.date),
            active: parseBoolean(req.query.active),
        };
        const imgs = await imgService.getMany(filters);
        return res.json({ ok: true, data: imgs, error: null });
    },
    get: async (req, res) => {
        const filters = {
            img_id: Number(req.query.img_id),
            description: parseString(req.query.description),
        };
        const img = await imgService.get(filters);
        return res.json({ ok: true, data: img, error: null });
    },
};
//# sourceMappingURL=img.controller.js.map