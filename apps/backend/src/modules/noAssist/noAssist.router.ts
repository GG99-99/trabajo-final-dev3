import { Router } from "express";
import { noAssistController } from "./noAssist.controller.js";

export const noAssistRouter: Router = Router();

noAssistRouter
  .get("/", noAssistController.getMany)
  .get("/detail", noAssistController.get)
  .post("/", noAssistController.create);
