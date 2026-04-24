import { fingerprintService } from "./fingerprint.service.js";
export const fingerprintController = {
    get: async (req, res) => {
        const worker_id = Number(req.query.worker_id);
        const fp = await fingerprintService.getByWorker(worker_id);
        return res.json({ ok: true, data: fp, error: null });
    },
    getAll: async (_req, res) => {
        const fps = await fingerprintService.getAll();
        return res.json({ ok: true, data: fps, error: null });
    },
    getMissingWorkers: async (_req, res) => {
        const workers = await fingerprintService.getWorkersWithoutFingerprint();
        return res.json({ ok: true, data: workers, error: null });
    },
    upsert: async (req, res) => {
        const { worker_id, template, finger_index } = req.body;
        const fp = await fingerprintService.upsert(Number(worker_id), template, Number(finger_index ?? 0));
        return res.json({ ok: true, data: fp, error: null });
    },
    delete: async (req, res) => {
        const worker_id = Number(req.params.worker_id ?? req.query.worker_id);
        await fingerprintService.delete(worker_id);
        return res.json({ ok: true, data: true, error: null });
    },
};
//# sourceMappingURL=fingerprint.controller.js.map