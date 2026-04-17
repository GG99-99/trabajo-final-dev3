import { Router } from "express";
import { providerController } from "./provider.controller.js";
export const providerRouter = Router();
providerRouter
    .get("/", providerController.getMany)
    .get("/detail", providerController.get)
    .post("/", providerController.create);
//# sourceMappingURL=provider.router.js.map