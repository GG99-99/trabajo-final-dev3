import { Request, Response, NextFunction } from "express";
/**
 * Middleware that checks req.user.tag === 'admin'.
 * Must be used AFTER validateJwtMiddleware.
 */
export declare function requireAdminTag(req: Request, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=requireAdmin.middleware.d.ts.map