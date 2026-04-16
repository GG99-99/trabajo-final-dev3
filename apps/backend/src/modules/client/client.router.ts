import { Router } from "express";
import { clientController } from "./client.controller.js";

export const clientRouter: Router = Router();

clientRouter
  .get("/", clientController.getMany)
  .get("/detail", clientController.get)
  .post("/", clientController.create);
