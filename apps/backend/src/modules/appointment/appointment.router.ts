import { Router } from 'express'
import { appointmentController } from './appointment.controller.js'

export const appointmentRouter: Router = Router()

appointmentRouter
  .get('/appointments',        appointmentController.getMany)
  .get('/appointments/blocks', appointmentController.getBlocks)
  .post('/appointments',       appointmentController.create)
  .put('/appointments/status', appointmentController.updateStatus)
