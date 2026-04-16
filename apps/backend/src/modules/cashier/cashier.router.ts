import { Router } from 'express'
import { cashierController } from './cashier.controller.js'

export const cashierRouter: Router = Router()

cashierRouter
  .get('/cashiers',        cashierController.getAll)
  .get('/cashiers/detail', cashierController.getOne)
  .post('/cashiers',       cashierController.create)
