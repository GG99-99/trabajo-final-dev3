import { Router } from "express";
import { scheduleController } from "./schedule.controller.js";
export const scheduleRouter = Router();
scheduleRouter
    .get("/", scheduleController.getMany)
    .get("/active", scheduleController.getActive)
    .get("/day-worker", scheduleController.getDayByWorker)
    .post("/", scheduleController.create)
    .put("/inactive", scheduleController.inactive);
//# sourceMappingURL=schedule.router.js.map