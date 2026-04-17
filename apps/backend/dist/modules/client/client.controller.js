import { clientService } from "./client.service.js";
export const clientController = {
    getMany: async (_req, res) => {
        const clients = await clientService.getMany();
        return res.json({ ok: true, data: clients, error: null });
    },
    get: async (req, res) => {
        const client_id = Number(req.query.client_id);
        const client = await clientService.get(client_id);
        return res.json({ ok: true, data: client, error: null });
    },
    create: async (req, res) => {
        const client = await clientService.create(req.body);
        return res.json({ ok: true, data: client, error: null });
    },
};
//# sourceMappingURL=client.controller.js.map