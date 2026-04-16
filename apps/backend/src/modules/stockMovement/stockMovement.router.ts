import { Router } from "express";
import { stockMovementController } from "./stockMovement.controller.js";

export const stockMovementRouter: Router = Router();

stockMovementRouter
  .get("/detail", stockMovementController.get);
