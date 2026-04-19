import { Router } from "express"
import { auditController } from "./audit.controller.js"

export const auditRouter: Router = Router()

auditRouter
    .get("/", auditController.getMany)
