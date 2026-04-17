import { Router } from "express";
import { productController } from "./product.controller.js";

export const productRouter: Router = Router();

productRouter
  .get("/", productController.getMany)
  .get("/detail", productController.get)
  .post("/", productController.create);
