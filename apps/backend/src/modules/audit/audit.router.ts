import { Router } from 'express'
import { auditController } from './audit.controller.js'
import { validateJwtMiddleware, requireAdminTag } from '#backend/middlewares'

export const auditRouter = Router()

auditRouter.get('/', validateJwtMiddleware, requireAdminTag, auditController.getMany)
