import { Request, Response } from "express";
import { CreateCategory, GetManyCategory, GetCategory } from "@final/shared";
import { categoryService } from "./category.service.js";
import { parseNumber } from "../common/controller.utils.js";

export const categoryController = {
  getMany: async (req: Request, res: Response) => {
    const filters: GetManyCategory = {};
    const categories = await categoryService.getMany(filters);
    return res.json({ ok: true, data: categories, error: null });
  },

  get: async (req: Request, res: Response) => {
    const filters: GetCategory = {
      category_id: parseNumber(req.query.category_id) ?? 0,
    };

    const category = await categoryService.get(filters);
    return res.json({ ok: true, data: category, error: null });
  },

  create: async (req: Request, res: Response) => {
    const payload: CreateCategory = req.body;
    const category = await categoryService.create(payload);
    return res.json({ ok: true, data: category, error: null });
  },
};
