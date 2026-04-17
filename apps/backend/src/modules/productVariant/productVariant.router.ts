import { Router } from "express";
import { productVariantController } from "./productVariant.controller.js";

export const productVariantRouter: Router = Router();

productVariantRouter
  .get("/", productVariantController.getMany)
  .get("/detail", productVariantController.get)
  .post("/", productVariantController.create);
