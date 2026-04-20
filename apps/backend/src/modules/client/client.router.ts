import { Router } from "express";
import { clientController } from "./client.controller.js";

export const clientRouter: Router = Router();

clientRouter
  .get("/", clientController.getMany)
  .get("/by-email", clientController.getByEmail)
  .get("/detail", clientController.get)
  .post("/", clientController.create)
  .delete("/:id", clientController.softDelete);
