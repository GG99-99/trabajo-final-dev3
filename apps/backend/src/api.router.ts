import { Router } from "express";
import { authRouter } from "./modules/auth/auth.router.js";


export const router: Router = Router()


router.use(authRouter)