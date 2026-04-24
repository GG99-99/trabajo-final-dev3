import { appointmentService } from '../appointment/appointment.service.js';
import { clientService } from '../client/client.service.js';
import { personService } from '../person/person.service.js';
import { tattooService } from '../tattoo/tattoo.service.js';
import { workerService } from '../worker/worker.service.js';
import { registerBooking } from '../../middlewares/rateLimit.middleware.js';
import { mailer } from '../../lib/mailer.js';
// ── In-memory OTP store (email → { code, expiresAt }) ──────────────────────
const otpStore = new Map();
const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes
// ── Verified emails store (email → expiresAt) ────────────────────────────────
// Only new users need to verify — existing clients are trusted by their record.
const verifiedStore = new Map();
const VERIFIED_TTL_MS = 30 * 60 * 1000; // 30 minutes to complete booking after verification
function generateOtp() {
    return String(Math.floor(100000 + Math.random() * 900000));
}
export const publicController = {
    /** GET /api/public/tattoos */
    getTattoos: async (_req, res) => {
        const tattoos = await tattooService.getMany();
        return res.json({ ok: true, data: tattoos, error: null });
    },
    /** GET /api/public/workers */
    getWorkers: async (_req, res) => {
        const workers = await workerService.getMany();
        return res.json({ ok: true, data: workers, error: null });
    },
    /** POST /api/public/send-code — send 6-digit OTP to email */
    sendCode: async (req, res) => {
        const email = String(req.body.email ?? '').trim().toLowerCase();
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ ok: false, data: null, error: { name: 'BadRequest', statusCode: 400, message: 'Valid email required.' } });
        }
        const code = generateOtp();
        otpStore.set(email, { code, expiresAt: Date.now() + OTP_TTL_MS });
        try {
            await mailer.sendOtp(email, code);
            return res.json({ ok: true, data: { sent: true }, error: null });
        }
        catch (err) {
            console.error('[public.sendCode] Mailer error:', err);
            return res.status(500).json({ ok: false, data: null, error: { name: 'MailError', statusCode: 500, message: 'Failed to send verification email.' } });
        }
    },
    /** POST /api/public/verify-code — verify the OTP */
    verifyCode: async (req, res) => {
        const email = String(req.body.email ?? '').trim().toLowerCase();
        const code = String(req.body.code ?? '').trim();
        if (!email || !code) {
            return res.status(400).json({ ok: false, data: null, error: { name: 'BadRequest', statusCode: 400, message: 'Email and code required.' } });
        }
        const entry = otpStore.get(email);
        if (!entry) {
            return res.status(400).json({ ok: false, data: null, error: { name: 'InvalidCode', statusCode: 400, message: 'No code was sent to this email or it has already been used.' } });
        }
        if (Date.now() > entry.expiresAt) {
            otpStore.delete(email);
            return res.status(400).json({ ok: false, data: null, error: { name: 'ExpiredCode', statusCode: 400, message: 'The verification code has expired. Please request a new one.' } });
        }
        if (entry.code !== code) {
            return res.status(400).json({ ok: false, data: null, error: { name: 'InvalidCode', statusCode: 400, message: 'Incorrect verification code.' } });
        }
        otpStore.delete(email); // single-use
        verifiedStore.set(email, Date.now() + VERIFIED_TTL_MS); // mark as verified
        return res.json({ ok: true, data: { verified: true }, error: null });
    },
    /** GET /api/public/check-email?email= — check if email is already a client */
    checkEmail: async (req, res) => {
        const email = String(req.query.email ?? '');
        if (!email)
            return res.status(400).json({ ok: false, data: null, error: { name: 'BadRequest', statusCode: 400, message: 'Email required' } });
        const person = await personService.get({ email, noPass: true });
        // Email belongs to a worker or cashier — block public booking
        if (person && (person.type === 'worker' || person.type === 'cashier')) {
            return res.json({
                ok: true,
                data: { exists: false, blocked: true, reason: 'staff' },
                error: null
            });
        }
        if (person && person.type === 'client') {
            const clients = await clientService.getMany();
            const client = clients.find(c => c.email === email);
            return res.json({ ok: true, data: { exists: true, blocked: false, first_name: person.first_name, last_name: person.last_name, client_id: client?.client_id }, error: null });
        }
        return res.json({ ok: true, data: { exists: false, blocked: false }, error: null });
    },
    /** GET /api/public/blocks?worker_id=&date= */
    getBlocks: async (req, res) => {
        const worker_id = Number(req.query.worker_id);
        const dateString = String(req.query.date);
        const blocks = await appointmentService.getBlocks({
            worker_id,
            date: new Date(dateString + 'T12:00:00.000Z'),
        });
        return res.json({ ok: true, data: blocks, error: null });
    },
    /** POST /api/public/book — rate-limited + IP daily guard */
    book: async (req, res) => {
        const { email, first_name, last_name, medical_notes, worker_id, tattoo_id, date, start, end } = req.body;
        const ip = req.ip ?? 'unknown';
        // Validate required fields
        if (!email || !first_name || !last_name || !worker_id || !tattoo_id || !date || !start || !end) {
            return res.status(400).json({
                ok: false, data: null,
                error: { name: 'BadRequest', statusCode: 400, message: 'Missing required fields.' }
            });
        }
        const dateStr = typeof date === 'string'
            ? date.slice(0, 10)
            : new Date(date).toISOString().slice(0, 10);
        // Check if this email already has an appointment on this date
        const person = await personService.get({ email, noPass: true });
        if (person?.type === 'client') {
            const clients = await clientService.getMany();
            const existingClient = clients.find(c => c.email === email);
            if (existingClient) {
                const existing = await appointmentService.getMany({
                    client_id: existingClient.client_id,
                    date: new Date(dateStr + 'T12:00:00.000Z'),
                });
                if (existing.length > 0) {
                    return res.status(409).json({
                        ok: false, data: null,
                        error: {
                            name: 'DuplicateBooking',
                            statusCode: 409,
                            message: 'This email already has an appointment on this date.'
                        }
                    });
                }
            }
        }
        // ── For new users, enforce OTP verification before creating account ────────
        if (!person || person.type !== 'client') {
            const verifiedUntil = verifiedStore.get(email);
            if (!verifiedUntil || Date.now() > verifiedUntil) {
                return res.status(403).json({
                    ok: false, data: null,
                    error: {
                        name: 'EmailNotVerified',
                        statusCode: 403,
                        message: 'New users must verify their email before booking. Please request a verification code.'
                    }
                });
            }
            verifiedStore.delete(email); // single-use: consumed on book
        }
        // Resolve or create client
        let client_id;
        if (person?.type === 'client') {
            const clients = await clientService.getMany();
            client_id = clients.find(c => c.email === email).client_id;
        }
        else {
            await clientService.create({
                first_name, last_name, email,
                password: '', type: 'client',
                medical_notes: medical_notes || undefined,
            });
            const clients = await clientService.getMany();
            client_id = clients.find(c => c.email === email).client_id;
        }
        // Create appointment
        const appointment = await appointmentService.create({
            worker_id: Number(worker_id),
            client_id,
            tattoo_id: Number(tattoo_id),
            start, end,
            date: new Date(dateStr + 'T12:00:00.000Z'),
        });
        if (!appointment) {
            return res.status(409).json({
                ok: false, data: null,
                error: { name: 'SlotUnavailable', statusCode: 409, message: 'The selected slot is no longer available.' }
            });
        }
        // Register this IP as having booked today
        registerBooking(ip);
        // ── Build appointment number like APPT-0042 ──────────────────────────────
        const apptNumber = `APPT-${String(appointment.appointment_id).padStart(4, '0')}`;
        // ── Resolve names for confirmation email ─────────────────────────────────
        try {
            const worker = await workerService.get(Number(worker_id));
            const tattoo = await tattooService.get({ tattoo_id: Number(tattoo_id) });
            const clientName = `${first_name} ${last_name}`;
            const workerName = worker ? `${worker.person.first_name} ${worker.person.last_name}` : 'Your artist';
            const tattooName = tattoo?.name ?? 'Your design';
            const formattedDate = new Date(dateStr + 'T12:00:00.000Z').toLocaleDateString('en-US', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
            });
            await mailer.sendAppointmentConfirmation(email, {
                clientName: clientName,
                workerName: workerName,
                tattooName: tattooName,
                date: formattedDate,
                start,
                end,
                apptNumber,
            });
        }
        catch (mailErr) {
            // Non-fatal: booking is confirmed even if email fails
            console.error('[public.book] Confirmation email failed:', mailErr);
        }
        return res.json({ ok: true, data: { ...appointment, apptNumber }, error: null });
    },
};
//# sourceMappingURL=public.controller.js.map