import { Router } from "express";
import { imgController } from "./img.controller.js";

export const imgRouter: Router = Router();

imgRouter
  .get("/", imgController.getMany)
  .get("/detail", imgController.get);
