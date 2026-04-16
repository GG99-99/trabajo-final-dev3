import { Router } from "express";
import { seatController } from "./seat.controller.js";

export const seatRouter: Router = Router();

seatRouter
  .get("/", seatController.getMany)
  .get("/detail", seatController.get);
