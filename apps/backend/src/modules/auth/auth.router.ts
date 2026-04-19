import { Router } from "express";
import { authController } from "./auth.controller.js";
import { requireRegisterToken } from "../../middlewares/auth/registerToken.middleware.js";
import { validateJwtMiddleware, requireAdminTag } from "#backend/middlewares";

export const authRouter: Router = Router()

authRouter
  .post('/login',    authController.login)
  .get('/register',  authController.getRegisterToken)
  .post('/register', requireRegisterToken, authController.register)
  .get('/token',     validateJwtMiddleware, authController.validateToken)

  // ── Admin-only token management ──────────────────────────────────────────
  .get('/admin/tokens',         validateJwtMiddleware, requireAdminTag, authController.getAdminTokens)
  .post('/admin/tokens/refresh', validateJwtMiddleware, requireAdminTag, authController.refreshAdminTokens)
