import { Router } from "express";
import { attendanceController } from "./attendance.controller.js";

export const attendanceRouter: Router = Router();

attendanceRouter
  .get("/", attendanceController.getMany)
  .get("/detail", attendanceController.get)
  .post("/", attendanceController.create);
