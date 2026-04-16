import { Router } from "express";
import { authRouter }        from "./modules/auth/auth.router.js";
import { workerRouter }      from "./modules/worker/worker.router.js";
import { clientRouter }      from "./modules/client/client.router.js";
import { cashierRouter }     from "./modules/cashier/cashier.router.js";
import { appointmentRouter } from "./modules/appointment/appointment.router.js";

export const router: Router = Router()

router.use(authRouter)
router.use(workerRouter)
router.use(clientRouter)
router.use(cashierRouter)
router.use(appointmentRouter)
