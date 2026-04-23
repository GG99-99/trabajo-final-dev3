import { Router } from "express";
import { clientController } from "./client.controller.js";
import { validateJwtOrCashierMiddleware } from "#backend/middlewares";

export const clientRouter: Router = Router();

clientRouter
  .use(validateJwtOrCashierMiddleware)
  .get("/", clientController.getMany)
  .get("/by-email", clientController.getByEmail)
  .get("/detail", clientController.get)
  .post("/", clientController.create)
  .delete("/:id", clientController.softDelete);
