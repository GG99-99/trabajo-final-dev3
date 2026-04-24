import { Router } from "express";
import { paymentController } from "./payment.controller.js";
import { validateJwtOrCashierMiddleware } from "#backend/middlewares";
export const paymentRouter = Router();
paymentRouter
    .use(validateJwtOrCashierMiddleware)
    .get("/", paymentController.getMany)
    .get("/detail", paymentController.get)
    .get("/month", paymentController.getManyByMonth)
    .post("/", paymentController.create); // falta validate type person
//# sourceMappingURL=payment.router.js.map