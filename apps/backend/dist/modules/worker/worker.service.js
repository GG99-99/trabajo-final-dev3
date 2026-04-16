import { workerModel } from "./worker.model.js";
import { workerUtils } from "./worker.utils.js";
import { log } from "#looger";
export const workerService = {
    get: async (worker_id) => {
        const w = await workerModel.get(worker_id);
        if (!w) {
            log.error("Se busco un worker que no existe");
            throw { statusCode: 400, name: "NotWorkerFound", message: "no se encontro el trabajador" };
        }
        return w;
    },
    getMany: async () => {
        const ws = await workerModel.getMany();
        if (ws.length === 0)
            return [];
        const workersPublics = [];
        for (const w of ws) {
            workersPublics.push(workerUtils.workerToPublic(w));
        }
        return workersPublics;
    }
};
//# sourceMappingURL=worker.service.js.map