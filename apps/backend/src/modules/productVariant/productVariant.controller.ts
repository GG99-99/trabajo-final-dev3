import { Request, Response } from "express";
import { CreateProductVariant, GetManyProductVariant, GetProductVariant } from "@final/shared";
import { productVariantService } from "./productVariant.service.js";
import { parseNumber, parseString } from "../common/controller.utils.js";

export const productVariantController = {
  getMany: async (req: Request, res: Response) => {
    const filters: GetManyProductVariant = {
      product_id: parseNumber(req.query.product_id),
      presentation: parseString(req.query.presentation),
    };

    const variants = await productVariantService.getMany(filters);
    return res.json({ ok: true, data: variants, error: null });
  },

  get: async (req: Request, res: Response) => {
    const filters: GetProductVariant = {
      product_variant_id: parseNumber(req.query.product_variant_id) ?? 0,
    };

    const variant = await productVariantService.get(filters);
    return res.json({ ok: true, data: variant, error: null });
  },

  create: async (req: Request, res: Response) => {
    const payload: CreateProductVariant = req.body;
    const variant = await productVariantService.create(payload);
    return res.json({ ok: true, data: variant, error: null });
  },
};
