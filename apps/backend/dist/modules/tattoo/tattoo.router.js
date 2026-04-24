import { Router } from "express";
import { tattooController } from "./tattoo.controller.js";
import multer from "multer";
import { validateJwtOrCashierMiddleware } from "#backend/middlewares";
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });
export const tattooRouter = Router();
tattooRouter
    .use(validateJwtOrCashierMiddleware)
    .get("/", tattooController.getMany)
    .get("/detail", tattooController.get)
    .get("/materials", tattooController.getMaterials)
    .post("/", upload.single("image"), tattooController.create)
    .post("/with-image", upload.single("image"), tattooController.createWithImage)
    .patch("/:tattoo_id", upload.single("image"), tattooController.update);
//# sourceMappingURL=tattoo.router.js.map