import { Router } from "express";
import { paymentController } from "./payment.controller.js";
import { valiateTypePerson, validateJwtMiddleware } from "#backend/middlewares";

export const paymentRouter: Router = Router();

paymentRouter
  .use(validateJwtMiddleware)
  .get("/", paymentController.getMany)
  .get("/detail", paymentController.get)
  .get("/month", paymentController.getManyByMonth)
  .post("/", paymentController.create); // falta validate type person
