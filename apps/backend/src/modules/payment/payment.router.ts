import { Router } from "express";
import { paymentController } from "./payment.controller.js";

export const paymentRouter: Router = Router();

paymentRouter
  .get("/", paymentController.getMany)
  .get("/detail", paymentController.get)
  .get("/month", paymentController.getManyByMonth)
  .post("/", paymentController.create);
