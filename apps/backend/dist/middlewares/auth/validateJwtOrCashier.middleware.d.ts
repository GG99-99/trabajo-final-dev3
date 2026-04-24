import type { Request, Response, NextFunction } from 'express';
/**
 * Acepta sesión vía cookie `jwt_token` (persona) o `cashier_jwt` (checkout cajero).
 */
export declare function validateJwtOrCashierMiddleware(req: Request, res: Response, next: NextFunction): void | Response<any, Record<string, any>>;
//# sourceMappingURL=validateJwtOrCashier.middleware.d.ts.map