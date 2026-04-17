import { Request, Response } from "express";
import { CreateProduct, GetManyProduct, GetProduct } from "@final/shared";
import { productService } from "./product.service.js";
import { parseNumber } from "../common/controller.utils.js";

export const productController = {
  getMany: async (req: Request, res: Response) => {
    const filters: GetManyProduct = {
      provider_id: parseNumber(req.query.provider_id),
      category_id: parseNumber(req.query.category_id),
    };

    const products = await productService.getMany(filters);
    return res.json({ ok: true, data: products, error: null });
  },

  get: async (req: Request, res: Response) => {
    const filters: GetProduct = {
      product_id: parseNumber(req.query.product_id) ?? 0,
    };

    const product = await productService.get(filters);
    return res.json({ ok: true, data: product, error: null });
  },

  create: async (req: Request, res: Response) => {
    const payload: CreateProduct = req.body;
    const product = await productService.create(payload);
    return res.json({ ok: true, data: product, error: null });
  },
};
