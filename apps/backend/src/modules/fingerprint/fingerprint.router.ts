import { Router } from "express"
import { fingerprintController } from "./fingerprint.controller.js"

export const fingerprintRouter: Router = Router()

fingerprintRouter
    .get("/",         fingerprintController.getAll)
    .get("/detail",   fingerprintController.get)
    .get("/missing",  fingerprintController.getMissingWorkers)
    .post("/",        fingerprintController.upsert)
    .delete("/:worker_id", fingerprintController.delete)
