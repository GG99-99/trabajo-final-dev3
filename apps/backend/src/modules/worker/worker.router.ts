import { Router } from "express";
import { workerController } from "./worker.controller.js";

export const workerRouter: Router = Router();

workerRouter
  .get("/", workerController.getMany)
  .get("/detail", workerController.get);
