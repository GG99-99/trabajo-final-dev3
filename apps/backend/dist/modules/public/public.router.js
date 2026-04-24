import { Router } from 'express';
import { publicController } from './public.controller.js';
import { publicBookingLimiter, ipDailyBookingGuard } from '../../middlewares/rateLimit.middleware.js';
export const publicRouter = Router();
publicRouter
    .get('/tattoos', publicController.getTattoos)
    .get('/workers', publicController.getWorkers)
    .get('/check-email', publicController.checkEmail)
    .get('/blocks', publicController.getBlocks)
    .post('/send-code', publicController.sendCode)
    .post('/verify-code', publicController.verifyCode)
    .post('/book', publicBookingLimiter, ipDailyBookingGuard, publicController.book);
//# sourceMappingURL=public.router.js.map