import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { decodeJwt } from '#backend/utils'
import type { CashierJwtPayload, UserCredentials } from '@final/shared'

function verifyMainJwtCookie(token: string): UserCredentials | null {
  try {
    return decodeJwt(token) as UserCredentials
  } catch {
    return null
  }
}

function verifyCashierJwtCookie(token: string): CashierJwtPayload | null {
  try {
    const decoded = jwt.verify(token, process.env.SECRET_JWT_KEY!) as CashierJwtPayload
    if (decoded.type !== 'cashier' || typeof decoded.cashier_id !== 'number') return null
    return decoded
  } catch {
    return null
  }
}

/**
 * Acepta sesión vía cookie `jwt_token` (persona) o `cashier_jwt` (checkout cajero).
 */
export function validateJwtOrCashierMiddleware(req: Request, res: Response, next: NextFunction) {
  const cashierToken = req.cookies?.cashier_jwt as string | undefined
  const mainToken = req.cookies?.jwt_token as string | undefined

  if (cashierToken) {
    const c = verifyCashierJwtCookie(cashierToken)
    if (c) {
      ;(req as Request & { user?: CashierJwtPayload | UserCredentials }).user = c
      return next()
    }
  }

  if (mainToken) {
    const u = verifyMainJwtCookie(mainToken)
    if (u) {
      ;(req as Request & { user?: CashierJwtPayload | UserCredentials }).user = u
      return next()
    }
  }

  return res.status(401).json({
    ok: false,
    data: null,
    error: {
      name: 'Unauthorized',
      statusCode: 401,
      message: 'Se requiere iniciar sesión (cajero o usuario).',
    },
  })
}
