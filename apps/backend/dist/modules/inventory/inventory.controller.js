import { inventoryService } from "./inventory.service.js";
import { parseNumber } from "../common/controller.utils.js";
export const inventoryController = {
    get: async (req, res) => {
        const filters = {
            inventory_item_id: Number(req.query.inventory_item_id),
            gte: parseNumber(req.query.gte),
        };
        const inventory = await inventoryService.get(filters);
        return res.json({ ok: true, data: inventory, error: null });
    },
    getTotalQuantity: async (req, res) => {
        const filters = {
            product_variant_id: Number(req.query.product_variant_id),
        };
        const total = await inventoryService.getTotalQuantity(filters);
        return res.json({ ok: true, data: total, error: null });
    },
    getNotExpired: async (req, res) => {
        const filters = {
            product_variant_id: Number(req.query.product_variant_id),
            gte: parseNumber(req.query.gte),
        };
        const items = await inventoryService.getNotExpired(filters);
        return res.json({ ok: true, data: items, error: null });
    },
    getManyNotExpired: async (req, res) => {
        const filters = {
            product_variant_id: Number(req.query.product_variant_id),
            gte: parseNumber(req.query.gte),
        };
        const items = await inventoryService.getManyNotExpired(filters);
        return res.json({ ok: true, data: items, error: null });
    },
    create: async (req, res) => {
        const payload = req.body;
        const item = await inventoryService.create(payload);
        return res.json({ ok: true, data: item, error: null });
    },
    updateQuantity: async (req, res) => {
        const payload = req.body;
        const result = await inventoryService.updateQuantityDirect(payload);
        return res.json({ ok: true, data: result, error: null });
    },
};
//# sourceMappingURL=inventory.controller.js.map