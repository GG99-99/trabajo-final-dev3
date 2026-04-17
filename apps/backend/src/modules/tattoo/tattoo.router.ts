import { Router } from "express";
import { tattooController } from "./tattoo.controller.js";

export const tattooRouter: Router = Router();

tattooRouter
  .get("/", tattooController.getMany)
  .get("/detail", tattooController.get)
  .get("/materials", tattooController.getMaterials)
  .post("/", tattooController.create);
