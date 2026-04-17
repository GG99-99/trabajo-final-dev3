import { Router } from "express";
import { stockMovementController } from "./stockMovement.controller.js";
export const stockMovementRouter = Router();
stockMovementRouter
    .get("/detail", stockMovementController.get);
//# sourceMappingURL=stockMovement.router.js.map