import { Router } from "express";
import { appointmentController } from "./appointment.controller.js";
import { validateJwtOrCashierMiddleware } from "#backend/middlewares";
export const appointmentRouter = Router();
appointmentRouter
    .use(validateJwtOrCashierMiddleware)
    .get("/", appointmentController.getMany)
    .get("/blocks", appointmentController.getBlocks)
    .post("/", appointmentController.create)
    .put("/status", appointmentController.updateStatus);
//# sourceMappingURL=appointment.router.js.map