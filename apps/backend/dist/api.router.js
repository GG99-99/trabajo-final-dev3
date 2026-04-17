import { Router } from "express";
import { authRouter } from "./modules/auth/auth.router.js";
export const router = Router();
router.use(authRouter);
//# sourceMappingURL=api.router.js.map