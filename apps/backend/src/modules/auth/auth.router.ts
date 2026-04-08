import { Router } from "express";
import { authController } from "./auth.controller.js";
// import { AUTH_ENDPOINTS } from "@final/shared";

export const authRouter: Router = Router()

authRouter
.post(
    '/login',
    authController.login
)
.post(
    '/register',
    authController.register
)