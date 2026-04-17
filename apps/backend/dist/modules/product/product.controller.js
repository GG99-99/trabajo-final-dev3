import { productService } from "./product.service.js";
import { parseNumber } from "../common/controller.utils.js";
export const productController = {
    getMany: async (req, res) => {
        const filters = {
            provider_id: parseNumber(req.query.provider_id),
            category_id: parseNumber(req.query.category_id),
        };
        const products = await productService.getMany(filters);
        return res.json({ ok: true, data: products, error: null });
    },
    get: async (req, res) => {
        const filters = {
            product_id: parseNumber(req.query.product_id) ?? 0,
        };
        const product = await productService.get(filters);
        return res.json({ ok: true, data: product, error: null });
    },
    create: async (req, res) => {
        const payload = req.body;
        const product = await productService.create(payload);
        return res.json({ ok: true, data: product, error: null });
    },
};
//# sourceMappingURL=product.controller.js.map