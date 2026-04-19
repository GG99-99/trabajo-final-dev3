import { Request, Response, NextFunction } from "express";

/**
 * Middleware that checks req.user.tag === 'admin'.
 * Must be used AFTER validateJwtMiddleware.
 */
export function requireAdminTag(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).user
  if (!user || user.tag !== 'admin') {
    return res.status(403).json({
      ok: false,
      data: null,
      error: { name: 'Forbidden', statusCode: 403, message: 'Se requiere tag de administrador' },
    })
  }
  next()
}
