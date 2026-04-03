import { Router } from "express";
import { authController } from "./auth.controller.js";
import { AUTH_ENDPOINTS } from "@final/shared";

export const authRouter: Router = Router()

authRouter
.post(
    AUTH_ENDPOINTS.LOGIN,
    authController.login
)

authRouter.post(
    AUTH_ENDPOINTS.REGISTER,
    authController.register
)