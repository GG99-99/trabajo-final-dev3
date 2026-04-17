import { Router } from "express";
import { appointmentController } from "./appointment.controller.js";
export const appointmentRouter = Router();
appointmentRouter
    .get("/", appointmentController.getMany)
    .get("/blocks", appointmentController.getBlocks)
    .post("/", appointmentController.create)
    .put("/status", appointmentController.updateStatus);
//# sourceMappingURL=appointment.router.js.map