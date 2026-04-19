import { Router } from "express"
import { punchController } from "./punch.controller.js"

export const punchRouter: Router = Router()

punchRouter
    .get("/status",  punchController.getTodayStatus)
    .get("/history", punchController.getHistory)
    .post("/in",     punchController.clockIn)
    .post("/out",    punchController.clockOut)
