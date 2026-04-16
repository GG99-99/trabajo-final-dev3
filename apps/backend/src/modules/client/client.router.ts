import { Router } from 'express'
import { clientController } from './client.controller.js'

export const clientRouter: Router = Router()

clientRouter
  .get('/clients',        clientController.getAll)
  .get('/clients/detail', clientController.getOne)
  .post('/clients',       clientController.create)
