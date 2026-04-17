import { categoryService } from "./category.service.js";
import { parseNumber } from "../common/controller.utils.js";
export const categoryController = {
    getMany: async (req, res) => {
        const filters = {};
        const categories = await categoryService.getMany(filters);
        return res.json({ ok: true, data: categories, error: null });
    },
    get: async (req, res) => {
        const filters = {
            category_id: parseNumber(req.query.category_id) ?? 0,
        };
        const category = await categoryService.get(filters);
        return res.json({ ok: true, data: category, error: null });
    },
    create: async (req, res) => {
        const payload = req.body;
        const category = await categoryService.create(payload);
        return res.json({ ok: true, data: category, error: null });
    },
};
//# sourceMappingURL=category.controller.js.map