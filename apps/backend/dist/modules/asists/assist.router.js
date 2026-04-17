import { Router } from "express";
import { assistController } from "./assist.controller.js";
export const assistRouter = Router();
assistRouter
    .get("/", assistController.getMany)
    .get("/detail", assistController.get)
    .post("/", assistController.create);
//# sourceMappingURL=assist.router.js.map