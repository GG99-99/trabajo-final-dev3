import { Request, Response } from "express";
import { GetStockMovementFilters } from "@final/shared";
import { sotckMovementService } from "./stockMovement.service.js";
import { parseBoolean, parseDate, parseNumber, parseString } from "../common/controller.utils.js";

export const stockMovementController = {
  get: async (req: Request, res: Response) => {
    const filters: GetStockMovementFilters = {
      stock_movement_id: parseNumber(req.query.stock_movement_id),
      inventory_item_id: parseNumber(req.query.inventory_item_id),
      quantity: parseNumber(req.query.quantity),
      type: parseString(req.query.type) as any,
      create_at: parseDate(req.query.create_at),
    };
    const stockMovement = await sotckMovementService.get(filters);
    return res.json({ ok: true, data: stockMovement, error: null });
  },
};
