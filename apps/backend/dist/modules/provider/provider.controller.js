import { providerService } from "./provider.service.js";
export const providerController = {
    getMany: async (_req, res) => {
        const providers = await providerService.getMany();
        return res.json({ ok: true, data: providers, error: null });
    },
    get: async (req, res) => {
        const filters = {
            provider_id: Number(req.query.provider_id),
        };
        const provider = await providerService.get(filters);
        return res.json({ ok: true, data: provider, error: null });
    },
    create: async (req, res) => {
        const payload = req.body;
        const provider = await providerService.create(payload);
        return res.json({ ok: true, data: provider, error: null });
    },
};
//# sourceMappingURL=provider.controller.js.map