import { Router } from "express";
import { cashierController } from "./cashier.controller.js";
export const cashierRouter = Router();
cashierRouter
    .get("/", cashierController.getMany)
    .get("/detail", cashierController.get)
    .post("/", cashierController.create);
//# sourceMappingURL=cashier.router.js.map