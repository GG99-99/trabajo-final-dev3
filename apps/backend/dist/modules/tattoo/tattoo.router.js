import { Router } from "express";
import { tattooController } from "./tattoo.controller.js";
export const tattooRouter = Router();
tattooRouter
    .get("/detail", tattooController.get)
    .get("/materials", tattooController.getMaterials)
    .post("/", tattooController.create);
//# sourceMappingURL=tattoo.router.js.map