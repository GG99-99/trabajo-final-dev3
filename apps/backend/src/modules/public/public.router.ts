import { Router } from 'express'
import { publicController } from './public.controller.js'
import { publicBookingLimiter, ipDailyBookingGuard } from '../../middlewares/rateLimit.middleware.js'

export const publicRouter: Router = Router()

publicRouter
  .get('/tattoos',  publicController.getTattoos)
  .get('/workers',  publicController.getWorkers)
  .get('/blocks',   publicController.getBlocks)
  .post('/book',    publicBookingLimiter, ipDailyBookingGuard, publicController.book)
