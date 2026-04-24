import { imgService } from "./img.service.js";
import { parseBoolean, parseDate, parseString } from "../common/controller.utils.js";
import prisma from "@final/db";
import { s3Service } from "../../lib/s3.js";
export const imgController = {
    getMany: async (req, res) => {
        const filters = {
            date: parseDate(req.query.date),
            active: parseBoolean(req.query.active),
        };
        const imgs = await imgService.getMany(filters);
        return res.json({ ok: true, data: imgs, error: null });
    },
    get: async (req, res) => {
        const filters = {
            img_id: Number(req.query.img_id),
            description: parseString(req.query.description),
        };
        const img = await imgService.get(filters);
        return res.json({ ok: true, data: img, error: null });
    },
    /**
     * GET /api/imgs/raw/:img_id
     * Serves the image: redirects to S3 URL if available, otherwise streams blob.
     */
    getRaw: async (req, res) => {
        const img_id = Number(req.params.img_id);
        const img = await prisma.img.findUnique({ where: { img_id } });
        if (!img)
            return res.status(404).send('Not found');
        // S3 image — redirect to public URL or presigned URL
        if (img.s3_url) {
            return res.redirect(302, img.s3_url);
        }
        if (img.s3_key) {
            const url = await s3Service.presign(img.s3_key);
            return res.redirect(302, url);
        }
        // Legacy blob fallback
        if (!img.source)
            return res.status(404).send('No image data');
        const buf = Buffer.from(img.source);
        let mime = 'image/jpeg';
        if (buf[0] === 0x89 && buf[1] === 0x50)
            mime = 'image/png';
        else if (buf[0] === 0x47 && buf[1] === 0x49)
            mime = 'image/gif';
        else if (buf[0] === 0x52 && buf[1] === 0x49)
            mime = 'image/webp';
        res.setHeader('Content-Type', mime);
        res.setHeader('Cache-Control', 'public, max-age=86400');
        return res.send(buf);
    },
    /**
     * POST /api/imgs — upload image to S3, store key+url in DB
     */
    create: async (req, res) => {
        const file = req.file;
        if (!file)
            return res.status(400).json({ ok: false, data: null, error: { name: 'BadRequest', statusCode: 400, message: 'No file uploaded' } });
        const { key, url } = await s3Service.upload(file.buffer, file.mimetype);
        const img = await prisma.img.create({
            data: {
                description: req.body.description ?? null,
                s3_key: key,
                s3_url: url,
            }
        });
        return res.json({ ok: true, data: { img_id: img.img_id, description: img.description, s3_url: url }, error: null });
    },
};
//# sourceMappingURL=img.controller.js.map