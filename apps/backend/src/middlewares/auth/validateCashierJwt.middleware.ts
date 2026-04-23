import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import type { CashierJwtPayload } from '@final/shared'

export function validateCashierJwtMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.cashier_jwt as string | undefined
  if (!token) {
    return res.status(401).json({
      ok: false,
      data: null,
      error: {
        name: 'Unauthorized',
        statusCode: 401,
        message: 'Sesión de cajero no encontrada.',
      },
    })
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_JWT_KEY!) as CashierJwtPayload
    if (decoded.type !== 'cashier' || typeof decoded.cashier_id !== 'number') {
      throw new Error('invalid payload')
    }
    ;(req as Request & { user?: CashierJwtPayload }).user = decoded
    return next()
  } catch {
    return res.status(401).json({
      ok: false,
      data: null,
      error: {
        name: 'InvalidToken',
        statusCode: 401,
        message: 'Token de cajero inválido o expirado.',
      },
    })
  }
}
