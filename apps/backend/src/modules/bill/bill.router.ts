import { Router } from "express";
import { billController } from "./bill.controller.js";

export const billRouter: Router = Router();

billRouter
  .get("/", billController.getMany)
  .get("/detail", billController.get)
  .get("/total", billController.getTotal)
  .get("/stock-movements", billController.getStockMovements)
  .get("/tattoos", billController.getTattoos)
  .post("/", billController.create);
