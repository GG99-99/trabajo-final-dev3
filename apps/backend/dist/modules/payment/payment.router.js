import { Router } from "express";
import { paymentController } from "./payment.controller.js";
import { validateJwtMiddleware } from "#backend/middlewares";
export const paymentRouter = Router();
paymentRouter
    .use(validateJwtMiddleware)
    .get("/", paymentController.getMany)
    .get("/detail", paymentController.get)
    .get("/month", paymentController.getManyByMonth)
    .post("/", paymentController.create); // falta validate type person
//# sourceMappingURL=payment.router.js.map