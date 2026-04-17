import { Router } from "express";
import { personController } from "./person.controller.js";
export const personRouter = Router();
personRouter
    .get("/detail", personController.get)
    .get("/all", personController.getMany);
// .post("/", personController.create);
//# sourceMappingURL=person.router.js.map