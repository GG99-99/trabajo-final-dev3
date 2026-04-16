import { Router } from 'express'
import { workerController } from './worker.controller.js'

export const workerRouter: Router = Router()

workerRouter
  .get('/workers',        workerController.getAll)
  .get('/workers/detail', workerController.getOne)
