import { Router } from "express";
import { categoryController } from "./category.controller.js";
export const categoryRouter = Router();
categoryRouter
    .get("/", categoryController.getMany)
    .get("/detail", categoryController.get)
    .post("/", categoryController.create);
//# sourceMappingURL=category.router.js.map