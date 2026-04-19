import { Router } from "express";
import { imgController } from "./img.controller.js";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } })

export const imgRouter: Router = Router();

imgRouter
  .get("/", imgController.getMany)
  .get("/detail", imgController.get)
  .get("/raw/:img_id", imgController.getRaw)
  .post("/", upload.single("file"), imgController.create);
