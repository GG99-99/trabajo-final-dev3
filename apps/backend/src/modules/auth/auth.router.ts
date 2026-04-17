import { Router } from "express";
import { authController } from "./auth.controller.js";
import { requireRegisterToken } from "../../middlewares/auth/registerToken.middleware.js";
import { validateJwtMiddleware } from "#backend/middlewares";
// import { AUTH_ENDPOINTS } from "@final/shared";

export const authRouter: Router = Router()

authRouter
.post(
    '/login',
    authController.login
)
.get(
    '/register',
    authController.getRegisterToken
)
.post(
    '/register',
    requireRegisterToken,
    authController.register
)
.get(
    '/token',
    validateJwtMiddleware,
    authController.validateToken
)
