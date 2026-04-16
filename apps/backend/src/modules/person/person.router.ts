import { Router } from "express";
import { personController } from "./person.controller.js";

export const personRouter: Router = Router();

personRouter
  .get("/detail", personController.get)
  .post("/", personController.create);
