import { authService } from './auth.services.js';
import { decodeJwt, printRegisterTokens, refreshIfExpired, registerTokens } from '#backend/utils';
const CASHIER_JWT_COOKIE = 'cashier_jwt';
const CASHIER_COOKIE_MS = 1000 * 60 * 60 * 24;
const cashierCookieOptions = () => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: CASHIER_COOKIE_MS,
    path: '/',
});
export const authController = {
    login: async (req, res) => {
        const dataLogin = req.body;
        const userCredentials = await authService.login(dataLogin);
        const token = authService.createToken(userCredentials);
        res.cookie("jwt_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 1000 * 60 * 60,
        });
        const response = { ok: true, data: userCredentials, error: null };
        return res.json(response);
    },
    register: async (req, res) => {
        const personData = req.body;
        // Token comes in the header (already validated by requireRegisterToken middleware)
        // Pass it along so authService can match it to the correct role
        const registrationToken = req.headers['x-registration-token'];
        await authService.register({ ...personData, token: registrationToken });
        const response = {
            ok: true,
            data: true,
            error: null
        };
        return res.json(response);
    },
    validateToken: async (req, res) => {
        const token = decodeJwt(req.cookies.jwt_token);
        return res.json({ ok: true, data: token, error: null });
    },
    getRegisterToken: async (req, res) => {
        refreshIfExpired("tokenWorker");
        refreshIfExpired("tokenCashier");
        printRegisterTokens();
        res.json({
            ok: true,
            data: {
                expiresAt: registerTokens.tokenWorker.expiresAt,
            },
            error: null
        });
    },
    /**
     * POST /api/auth/admin/tokens
     * Solo accesible para usuarios con tag === 'admin'.
     * Devuelve los tokens actuales (worker y cashier), regenerándolos si expiraron.
     */
    getAdminTokens: async (req, res) => {
        refreshIfExpired("tokenWorker");
        refreshIfExpired("tokenCashier");
        return res.json({
            ok: true,
            data: {
                tokenWorker: {
                    value: registerTokens.tokenWorker.value,
                    expiresAt: registerTokens.tokenWorker.expiresAt,
                },
                tokenCashier: {
                    value: registerTokens.tokenCashier.value,
                    expiresAt: registerTokens.tokenCashier.expiresAt,
                },
            },
            error: null,
        });
    },
    /**
     * POST /api/auth/admin/tokens/refresh
     * Fuerza la regeneración de ambos tokens (aunque no hayan expirado).
     */
    refreshAdminTokens: async (req, res) => {
        // Force regenerate regardless of expiry
        const { generateToken } = await import('#backend/utils');
        const TTL = 10 * 60 * 1000;
        registerTokens.tokenWorker = { value: generateToken(32), expiresAt: Date.now() + TTL };
        registerTokens.tokenCashier = { value: generateToken(32), expiresAt: Date.now() + TTL };
        printRegisterTokens();
        return res.json({
            ok: true,
            data: {
                tokenWorker: {
                    value: registerTokens.tokenWorker.value,
                    expiresAt: registerTokens.tokenWorker.expiresAt,
                },
                tokenCashier: {
                    value: registerTokens.tokenCashier.value,
                    expiresAt: registerTokens.tokenCashier.expiresAt,
                },
            },
            error: null,
        });
    },
    loginCashier: async (req, res) => {
        try {
            const dataLogin = req.body;
            const payload = await authService.loginCashier(dataLogin);
            const token = authService.createCashierToken(payload);
            res.cookie(CASHIER_JWT_COOKIE, token, cashierCookieOptions());
            const response = { ok: true, data: payload, error: null };
            return res.json(response);
        }
        catch (err) {
            const e = err;
            const statusCode = e.statusCode ?? 401;
            const message = e.message ?? 'Error al iniciar sesión';
            return res.status(statusCode).json({
                ok: false,
                data: null,
                error: { name: e.name ?? 'LoginError', statusCode, message },
            });
        }
    },
    logoutCashier: async (_req, res) => {
        res.clearCookie(CASHIER_JWT_COOKIE, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
        });
        return res.json({ ok: true, data: true, error: null });
    },
    meCashier: async (req, res) => {
        const user = req.user;
        return res.json({ ok: true, data: user, error: null });
    },
};
//# sourceMappingURL=auth.controller.js.map