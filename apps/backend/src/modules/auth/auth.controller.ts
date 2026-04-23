import { Request, Response } from 'express'
import { authService } from './auth.services.js'
import {
  UserCredentials,
  ApiResponse,
  CreatePerson,
  LoginData,
  RegisterToken,
  CashierJwtPayload,
} from '@final/shared'
import { decodeJwt, printRegisterTokens, refreshIfExpired, registerTokens } from '#backend/utils'

const CASHIER_JWT_COOKIE = 'cashier_jwt'
const CASHIER_COOKIE_MS = 1000 * 60 * 60 * 24

const cashierCookieOptions = (): import('express').CookieOptions => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: CASHIER_COOKIE_MS,
  path: '/',
})


export const authController = {
    login: async (req: Request, res: Response) => {
        const dataLogin: LoginData = req.body
        const userCredentials: UserCredentials = await authService.login(dataLogin)
        const token = authService.createToken(userCredentials)

        res.cookie("jwt_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 1000 * 60 * 60,
          });

        const response: ApiResponse<UserCredentials> = { ok: true, data: userCredentials, error: null };
        return res.json(response)
    },

    register: async (req: Request, res: Response) => {
        const personData: CreatePerson = req.body
        // Token comes in the header (already validated by requireRegisterToken middleware)
        // Pass it along so authService can match it to the correct role
        const registrationToken = req.headers['x-registration-token'] as string
        await authService.register({ ...personData, token: registrationToken })
        const response: ApiResponse<boolean> = {
            ok: true,
            data: true,
            error: null
        }
        return res.json(response)
    },

    validateToken: async (req: Request, res: Response) => { 
        const token = decodeJwt(req.cookies.jwt_token)
        return res.json({ok: true, data: token, error: null})
    },

    getRegisterToken: async (req: Request, res: Response) => {
        refreshIfExpired("tokenWorker");
        refreshIfExpired("tokenCashier");
        printRegisterTokens()
        res.json({
            ok: true,
            data: {
                expiresAt: registerTokens.tokenWorker.expiresAt,
            },
            error: null
        } as ApiResponse<RegisterToken>);
    },

    /**
     * POST /api/auth/admin/tokens
     * Solo accesible para usuarios con tag === 'admin'.
     * Devuelve los tokens actuales (worker y cashier), regenerándolos si expiraron.
     */
    getAdminTokens: async (req: Request, res: Response) => {
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
        })
    },

    /**
     * POST /api/auth/admin/tokens/refresh
     * Fuerza la regeneración de ambos tokens (aunque no hayan expirado).
     */
    refreshAdminTokens: async (req: Request, res: Response) => {
        // Force regenerate regardless of expiry
        const { generateToken } = await import('#backend/utils')
        const TTL = 10 * 60 * 1000

        registerTokens.tokenWorker  = { value: generateToken(32), expiresAt: Date.now() + TTL }
        registerTokens.tokenCashier = { value: generateToken(32), expiresAt: Date.now() + TTL }

        printRegisterTokens()

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
        })
    },

    loginCashier: async (req: Request, res: Response) => {
        try {
            const dataLogin: LoginData = req.body
            const payload: CashierJwtPayload = await authService.loginCashier(dataLogin)
            const token = authService.createCashierToken(payload)
            res.cookie(CASHIER_JWT_COOKIE, token, cashierCookieOptions())
            const response: ApiResponse<CashierJwtPayload> = { ok: true, data: payload, error: null }
            return res.json(response)
        } catch (err: unknown) {
            const e = err as { statusCode?: number; message?: string; name?: string }
            const statusCode = e.statusCode ?? 401
            const message = e.message ?? 'Error al iniciar sesión'
            return res.status(statusCode).json({
                ok: false,
                data: null,
                error: { name: e.name ?? 'LoginError', statusCode, message },
            })
        }
    },

    logoutCashier: async (_req: Request, res: Response) => {
        res.clearCookie(CASHIER_JWT_COOKIE, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
        })
        return res.json({ ok: true, data: true, error: null } as ApiResponse<boolean>)
    },

    meCashier: async (req: Request, res: Response) => {
        const user = (req as Request & { user?: CashierJwtPayload }).user!
        return res.json({ ok: true, data: user, error: null } as ApiResponse<CashierJwtPayload>)
    },
}
