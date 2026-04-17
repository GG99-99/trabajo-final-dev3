import { Router } from "express";
import { attendanceController } from "./attendance.controller.js";
export const attendanceRouter = Router();
attendanceRouter
    .get("/", attendanceController.getMany)
    .get("/detail", attendanceController.get)
    .post("/", attendanceController.create);
//# sourceMappingURL=attendance.router.js.map