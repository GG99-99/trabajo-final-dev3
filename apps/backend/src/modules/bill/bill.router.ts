import { Router } from "express";
import { billController } from "./bill.controller.js";
import { validateJwtOrCashierMiddleware } from "#backend/middlewares";

export const billRouter: Router = Router();

billRouter
  .use(validateJwtOrCashierMiddleware)
  .get("/", billController.getMany)
  .get("/detail", billController.get)
  .get("/total", billController.getTotal)
  .get("/stock-movements", billController.getStockMovements)
  .get("/tattoos", billController.getTattoos)
  .post("/", billController.create)
  .put("/state", billController.updateState);
