import { Router } from "express";
import { inventoryController } from "./inventory.controller.js";

export const inventoryRouter: Router = Router();

inventoryRouter
  .get("/", inventoryController.get)
  .get("/total-quantity", inventoryController.getTotalQuantity)
  .get("/not-expired", inventoryController.getNotExpired)
  .get("/not-expired-list", inventoryController.getManyNotExpired)
  .post("/", inventoryController.create)
  .put("/quantity", inventoryController.updateQuantity);
