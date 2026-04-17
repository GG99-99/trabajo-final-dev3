import { tattooService } from "./tattoo.service.js";
export const tattooController = {
    get: async (req, res) => {
        const filters = {
            tattoo_id: Number(req.query.tattoo_id),
        };
        const tattoo = await tattooService.get(filters);
        return res.json({ ok: true, data: tattoo, error: null });
    },
    getMaterials: async (req, res) => {
        const filters = {
            tattoo_id: Number(req.query.tattoo_id),
        };
        const materials = await tattooService.getMaterials(filters);
        return res.json({ ok: true, data: materials, error: null });
    },
    create: async (req, res) => {
        const payload = req.body;
        const tattoo = await tattooService.create(payload);
        return res.json({ ok: true, data: tattoo, error: null });
    },
};
//# sourceMappingURL=tattoo.controller.js.map