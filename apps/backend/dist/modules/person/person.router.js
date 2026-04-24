import { Router } from "express";
import { personController } from "./person.controller.js";
export const personRouter = Router();
personRouter
    .get("/detail", personController.get)
    .get("/all", personController.getMany)
    .post("/", personController.create)
    .put("/update", personController.update)
    .put("/ban", personController.ban)
    .delete("/:id", personController.softDelete);
//# sourceMappingURL=person.router.js.map