import type { Request, Response, NextFunction } from 'express';
/** Call this after a successful booking to register the IP */
export declare function registerBooking(ip: string): void;
/** Middleware: block IPs that already booked today */
export declare function ipDailyBookingGuard(req: Request, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
export declare const publicBookingLimiter: import("express-rate-limit").RateLimitRequestHandler;
//# sourceMappingURL=rateLimit.middleware.d.ts.map