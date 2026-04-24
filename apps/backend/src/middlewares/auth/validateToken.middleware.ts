/**
 * validateToken.middleware.ts
 * Middleware de validación JWT con cache en Redis.
 *
 * Flujo con resiliencia:
 *   1. Lee el token de la cookie.
 *   2. Busca el payload decodificado en Redis (cache por token hash).
 *   3. Si está en cache → adjunta req.user sin tocar la DB.
 *   4. Si no → decodifica con jwt.verify(), guarda en Redis (TTL 1h).
 *   5. Si Redis está caído → decodifica cada vez (comportamiento previo).
 */

import { decodeJwt } from '#backend/utils'
import { Request, Response, NextFunction } from 'express'
import { safeRedis } from '../../lib/redis.js'
import { TTL } from '../../lib/cache.js'
import crypto from 'crypto'

function tokenHash(token: string): string {
  return 'auth:token:' + crypto.createHash('sha256').update(token).digest('hex').slice(0, 32)
}

export async function validateJwtMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.cookies.jwt_token

  if (!token) {
    return res.status(401).json({
      ok: false,
      data: null,
      error: { name: 'InvalidToken', statusCode: 401, message: 'token invalido' },
    })
  }

  try {
    const cacheKey = tokenHash(token)

    // Intentar cache primero
    const cached = await safeRedis(r => r.get(cacheKey), null)
    if (cached) {
      try {
        (req as any).user = JSON.parse(cached)
        return next()
      } catch { /* cache corrupta, sigue */ }
    }

    // Verificar y decodificar
    const decoded = decodeJwt(token)
    ;(req as any).user = decoded

    // Guardar en cache con TTL de 1h (igual que la expiración del JWT)
    await safeRedis(
      r => r.setex(cacheKey, TTL.AUTH, JSON.stringify(decoded)),
      undefined
    )

    next()
  } catch {
    return res.status(401).json({
      ok: false,
      data: null,
      error: { name: 'InvalidToken', statusCode: 401, message: 'token invalido' },
    })
  }
}
