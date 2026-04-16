import { Request, Response } from "express";
import { CreateInventoryItem, GetInventoryFilters, GetNotExpired, GetQuantityInventoryFilters } from "@final/shared";
import { inventoryService } from "./inventory.service.js";
import { parseNumber } from "../common/controller.utils.js";

export const inventoryController = {
  get: async (req: Request, res: Response) => {
    const filters: GetInventoryFilters = {
      inventory_item_id: Number(req.query.inventory_item_id),
      gte: parseNumber(req.query.gte),
    };
    const inventory = await inventoryService.get(filters);
    return res.json({ ok: true, data: inventory, error: null });
  },

  getTotalQuantity: async (req: Request, res: Response) => {
    const filters: GetQuantityInventoryFilters = {
      product_variant_id: Number(req.query.product_variant_id),
    };
    const total = await inventoryService.getTotalQuantity(filters);
    return res.json({ ok: true, data: total, error: null });
  },

  getNotExpired: async (req: Request, res: Response) => {
    const filters: GetNotExpired = {
      product_variant_id: Number(req.query.product_variant_id),
      gte: parseNumber(req.query.gte),
    };
    const items = await inventoryService.getNotExpired(filters);
    return res.json({ ok: true, data: items, error: null });
  },

  getManyNotExpired: async (req: Request, res: Response) => {
    const filters: GetNotExpired = {
      product_variant_id: Number(req.query.product_variant_id),
      gte: parseNumber(req.query.gte),
    };
    const items = await inventoryService.getManyNotExpired(filters);
    return res.json({ ok: true, data: items, error: null });
  },

  create: async (req: Request, res: Response) => {
    const payload: CreateInventoryItem = req.body;
    const item = await inventoryService.create(payload);
    return res.json({ ok: true, data: item, error: null });
  },
};
