import { Router } from "express";
import { workerController } from "./worker.controller.js";
import { validateJwtOrCashierMiddleware } from "#backend/middlewares";
export const workerRouter = Router();
workerRouter
    .use(validateJwtOrCashierMiddleware)
    .get("/", workerController.getMany)
    .get("/detail", workerController.get);
//# sourceMappingURL=worker.router.js.map