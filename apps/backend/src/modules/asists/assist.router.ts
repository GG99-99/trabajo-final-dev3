import { Router } from "express";
import { assistController } from "./assist.controller.js";

export const assistRouter: Router = Router();

assistRouter
  .get("/", assistController.getMany)
  .get("/detail", assistController.get)
  .post("/", assistController.create);
