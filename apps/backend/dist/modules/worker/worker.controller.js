import { workerService } from "./worker.service.js";
export const workerController = {
    getMany: async (_req, res) => {
        const workers = await workerService.getMany();
        return res.json({ ok: true, data: workers, error: null });
    },
    get: async (req, res) => {
        const worker_id = Number(req.query.worker_id);
        const worker = await workerService.get(worker_id);
        return res.json({ ok: true, data: worker, error: null });
    },
};
//# sourceMappingURL=worker.controller.js.map