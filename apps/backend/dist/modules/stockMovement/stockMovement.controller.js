import { stockMovementService } from "./stockMovement.service.js";
import { parseDate, parseNumber, parseString } from "../common/controller.utils.js";
export const stockMovementController = {
    get: async (req, res) => {
        const filters = {
            stock_movement_id: parseNumber(req.query.stock_movement_id),
            inventory_item_id: parseNumber(req.query.inventory_item_id),
            quantity: parseNumber(req.query.quantity),
            type: parseString(req.query.type),
            create_at: parseDate(req.query.create_at),
        };
        const stockMovement = await stockMovementService.get(filters);
        return res.json({ ok: true, data: stockMovement, error: null });
    },
};
//# sourceMappingURL=stockMovement.controller.js.map