import { Router } from "express";
import { cashierController } from "./cashier.controller.js";

export const cashierRouter: Router = Router();

cashierRouter
  .get("/", cashierController.getMany)
  .get("/detail", cashierController.get)
  .post("/", cashierController.create);
