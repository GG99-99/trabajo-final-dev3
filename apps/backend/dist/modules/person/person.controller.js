import { personService } from "./person.service.js";
import { parseBoolean, parseNumber, parseString } from "../common/controller.utils.js";
export const personController = {
    get: async (req, res) => {
        const filters = {
            person_id: parseNumber(req.query.person_id),
            email: parseString(req.query.email),
            noPass: parseBoolean(req.query.noPass),
        };
        const person = await personService.get(filters);
        return res.json({ ok: true, data: person, error: null });
    },
    getMany: async (_req, res) => {
        const persons = await personService.getMany();
        return res.json({ ok: true, data: persons, error: null });
    },
    create: async (req, res) => {
        const payload = req.body;
        const person = await personService.create(payload);
        return res.json({ ok: true, data: person, error: null });
    },
    update: async (req, res) => {
        const person_id = parseNumber(req.query.person_id) ?? Number(req.body.person_id);
        if (!person_id) {
            return res.status(400).json({ ok: false, data: null, error: { name: 'BadRequest', statusCode: 400, message: 'person_id required' } });
        }
        const { first_name, last_name, email, password, specialty, medical_notes } = req.body;
        const updated = await personService.update(person_id, {
            first_name, last_name, email, password, specialty, medical_notes,
        });
        return res.json({ ok: true, data: updated, error: null });
    },
    ban: async (req, res) => {
        const { person_id, banned } = req.body;
        if (!person_id) {
            return res.status(400).json({ ok: false, data: null, error: { name: 'BadRequest', statusCode: 400, message: 'person_id required' } });
        }
        const result = await personService.ban(Number(person_id), Boolean(banned));
        return res.json({ ok: true, data: result, error: null });
    },
    softDelete: async (req, res) => {
        const person_id = parseNumber(req.params.id) ?? parseNumber(req.query.person_id);
        if (!person_id) {
            return res.status(400).json({ ok: false, data: null, error: { name: 'BadRequest', statusCode: 400, message: 'person_id required' } });
        }
        await personService.softDelete(person_id);
        return res.json({ ok: true, data: true, error: null });
    },
};
//# sourceMappingURL=person.controller.js.map