import { Request, Response } from "express";
import { GetImg, GetManyImg } from "@final/shared";
import { imgService } from "./img.service.js";
import { parseBoolean, parseDate, parseNumber, parseString } from "../common/controller.utils.js";

export const imgController = {
  getMany: async (req: Request, res: Response) => {
    const filters: GetManyImg = {
      date: parseDate(req.query.date),
      active: parseBoolean(req.query.active),
    };
    const imgs = await imgService.getMany(filters);
    return res.json({ ok: true, data: imgs, error: null });
  },

  get: async (req: Request, res: Response) => {
    const filters: GetImg = {
      img_id: Number(req.query.img_id),
      description: parseString(req.query.description),
    };
    const img = await imgService.get(filters);
    return res.json({ ok: true, data: img, error: null });
  },
};
