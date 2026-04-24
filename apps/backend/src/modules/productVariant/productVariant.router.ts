import { Router } from "express";
import { productVariantController } from "./productVariant.controller.js";
import { validateJwtOrCashierMiddleware } from "#backend/middlewares";

export const productVariantRouter: Router = Router();

productVariantRouter
  .use(validateJwtOrCashierMiddleware)
  .get("/", productVariantController.getMany)
  .get("/detail", productVariantController.get)
  .post("/", productVariantController.create);
