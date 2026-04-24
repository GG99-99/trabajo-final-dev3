import { appointmentService } from "./appointment.service.js";
export const appointmentController = {
    getMany: async (req, res) => {
        const filters = {
            appointment_id: req.query.appointment_id ? Number(req.query.appointment_id) : undefined,
            worker_id: req.query.worker_id ? Number(req.query.worker_id) : undefined,
            client_id: req.query.client_id ? Number(req.query.client_id) : undefined,
            tattoo_id: req.query.tattoo_id ? Number(req.query.tattoo_id) : undefined,
            start: req.query.start ? String(req.query.start) : undefined,
            end: req.query.end ? String(req.query.end) : undefined,
            date: req.query.date ? new Date(String(req.query.date)) : undefined,
            status: req.query.status ? req.query.status : undefined,
        };
        const appointments = await appointmentService.getMany(filters);
        return res.json({ ok: true, data: appointments, error: null });
    },
    getBlocks: async (req, res) => {
        try {
            const worker_id = Number(req.query.worker_id);
            const dateString = String(req.query.date);
            const blocks = await appointmentService.getBlocks({
                worker_id,
                date: new Date(dateString + 'T12:00:00'),
            });
            return res.json({ ok: true, data: blocks, error: null });
        }
        catch (err) {
            console.error('[getBlocks error]', err);
            return res.status(err?.statusCode || 500).json({
                ok: false, data: null,
                error: { name: err?.name || 'Error', statusCode: err?.statusCode || 500, message: err?.message || String(err) }
            });
        }
    },
    create: async (req, res) => {
        const rawDate = req.body.date;
        const dateStr = typeof rawDate === 'string'
            ? rawDate.slice(0, 10)
            : new Date(rawDate).toISOString().slice(0, 10);
        const data = { ...req.body, date: new Date(dateStr + 'T12:00:00.000Z') };
        const appointment = await appointmentService.create(data);
        return res.json({ ok: true, data: appointment, error: null });
    },
    updateStatus: async (req, res) => {
        const appointment_id = Number(req.body.appointment_id ?? req.query.appointment_id);
        const status = (req.body.status ?? req.query.status);
        const result = await appointmentService.updateStatusDirect(appointment_id, status);
        return res.json({ ok: true, data: result, error: null });
    },
};
//# sourceMappingURL=appointment.controller.js.map