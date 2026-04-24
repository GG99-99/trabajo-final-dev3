import { Router } from "express";
import { fingerprintController } from "./fingerprint.controller.js";
export const fingerprintRouter = Router();
fingerprintRouter
    .get("/", fingerprintController.getAll)
    .get("/detail", fingerprintController.get)
    .get("/missing", fingerprintController.getMissingWorkers)
    .post("/", fingerprintController.upsert)
    .delete("/:worker_id", fingerprintController.delete);
//# sourceMappingURL=fingerprint.router.js.map