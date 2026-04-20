import { Router } from "express";
import { billController } from "./bill.controller.js";
// import { validateJwtMiddleware } from "../../middlewares/index.middlewares.js";
// import { valiateTypePerson } from "../../middlewares/auth/validateTypePerson.middleware.js";

export const billRouter: Router = Router();

billRouter
  // .use(validateJwtMiddleware)
  .get("/", billController.getMany)
  .get("/detail", billController.get)
  .get("/total", billController.getTotal)
  .get("/stock-movements", billController.getStockMovements)
  .get("/tattoos", billController.getTattoos)
  .post("/", billController.create)
  .put("/state", billController.updateState);
