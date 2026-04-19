import { Request, Response } from "express";
import { CreateTattooRequest, GetTattoo, GetTattooMaterials } from "@final/shared";
import { tattooService } from "./tattoo.service.js";
import { parseNumber, parseString } from "../common/controller.utils.js";
import prisma from "@final/db";
import { s3Service } from "../../lib/s3.js";

export const tattooController = {
  get: async (req: Request, res: Response) => {
    const filters: GetTattoo = { tattoo_id: Number(req.query.tattoo_id) };
    const tattoo = await tattooService.get(filters);
    return res.json({ ok: true, data: tattoo, error: null });
  },

  getMany: async (_req: Request, res: Response) => {
    const tattoos = await tattooService.getMany();
    return res.json({ ok: true, data: tattoos, error: null });
  },

  getMaterials: async (req: Request, res: Response) => {
    const filters: GetTattooMaterials = { tattoo_id: Number(req.query.tattoo_id) };
    const materials = await tattooService.getMaterials(filters);
    return res.json({ ok: true, data: materials, error: null });
  },

  create: async (req: Request, res: Response) => {
    const payload: CreateTattooRequest = req.body;
    const tattoo = await tattooService.create(payload);
    return res.json({ ok: true, data: tattoo, error: null });
  },

  /** POST /api/tattoos/with-image — multipart: image file + JSON fields */
  createWithImage: async (req: Request, res: Response) => {
    const file = (req as any).file as Express.Multer.File | undefined
    if (!file) return res.status(400).json({ ok: false, data: null, error: { name: 'BadRequest', statusCode: 400, message: 'Image file is required' } })

    const { name, cost, time, description } = req.body
    if (!name || !cost || !time) return res.status(400).json({ ok: false, data: null, error: { name: 'BadRequest', statusCode: 400, message: 'name, cost and time are required' } })

    const tattoo = await prisma.$transaction(async (tx) => {
      // Upload to S3
      const { key, url } = await s3Service.upload(file.buffer, file.mimetype)
      const img = await tx.img.create({
        data: { description: description ?? null, s3_key: key, s3_url: url }
      })
      return await tx.tattoo.create({
        data: { img_id: img.img_id, name, cost: parseFloat(cost), time },
        include: { img: { select: { img_id: true, s3_url: true, s3_key: true } } }
      })
    })

    return res.json({ ok: true, data: tattoo, error: null })
  },

  /** PATCH /api/tattoos/:tattoo_id — update fields and optionally replace image */
  update: async (req: Request, res: Response) => {
    const tattoo_id = Number(req.params.tattoo_id)
    const { name, cost, time, description } = req.body
    const file = (req as any).file as Express.Multer.File | undefined

    const tattoo = await prisma.$transaction(async (tx) => {
      if (file) {
        const existing = await tx.tattoo.findUnique({ where: { tattoo_id } })
        if (existing) {
          // Delete old S3 object if exists
          const oldImg = await tx.img.findUnique({ where: { img_id: existing.img_id } })
          if (oldImg?.s3_key) await s3Service.delete(oldImg.s3_key).catch(() => null)

          // Upload new image to S3
          const { key, url } = await s3Service.upload(file.buffer, file.mimetype)
          await tx.img.update({
            where: { img_id: existing.img_id },
            data: { s3_key: key, s3_url: url, ...(description !== undefined && { description }) }
          })
        }
      }
      return await tx.tattoo.update({
        where: { tattoo_id },
        data: {
          ...(name && { name }),
          ...(cost && { cost: parseFloat(cost) }),
          ...(time && { time }),
        },
        include: { img: { select: { img_id: true, s3_url: true, s3_key: true } } }
      })
    })

    return res.json({ ok: true, data: tattoo, error: null })
  },
};
