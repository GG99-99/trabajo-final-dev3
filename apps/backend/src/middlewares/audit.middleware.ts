import { Request, Response, NextFunction } from 'express'
import { auditService } from '../modules/audit/audit.service.js'
import { decodeJwt } from '#backend/utils'

const METHOD_ACTION: Record<string, string> = {
  POST:   'CREATE',
  PUT:    'UPDATE',
  PATCH:  'UPDATE',
  DELETE: 'DELETE',
}

// Maps the first URL segment to a clean entity name
const ENTITY_MAP: Record<string, string> = {
  appointments:     'appointment',
  payments:         'payment',
  bills:            'bill',
  persons:          'person',
  workers:          'worker',
  cashiers:         'cashier',
  clients:          'client',
  products:         'product',
  inventory:        'inventory',
  'stock-movements':'stock_movement',
  tattoos:          'tattoo',
  schedules:        'schedule',
  seats:            'seat',
  auth:             'auth',
  providers:        'provider',
  categories:       'category',
  attendances:      'attendance',
  assists:          'assist',
}

function getAction(method: string, path: string): string {
  if (path.includes('/login'))        return 'LOGIN'
  if (path.includes('/register'))     return 'REGISTER'
  if (path.includes('/tokens/refresh')) return 'TOKEN_REFRESH'
  if (path.includes('/ban'))          return 'BAN'
  if (path.includes('/refund'))       return 'REFUND'
  if (path.includes('/payments') && method === 'POST') return 'PAYMENT'
  return METHOD_ACTION[method] ?? method
}

export function auditMiddleware(req: Request, res: Response, next: NextFunction) {
  // Only log mutating methods
  if (req.method === 'GET') return next()

  const originalJson = res.json.bind(res)

  res.json = function (body: unknown) {
    // Only audit successful responses
    if ((body as { ok?: boolean })?.ok === true) {
      try {
        const segments = req.path.replace(/^\//, '').split('/').filter(Boolean)
        const firstSeg = segments[0] ?? 'unknown'
        const entity   = ENTITY_MAP[firstSeg] ?? firstSeg
        const action   = getAction(req.method, req.path)

        let person_id: number | null = null
        try {
          const jwt = decodeJwt(req.cookies?.jwt_token)
          if (jwt?.person_id) person_id = jwt.person_id
        } catch { /* unauthenticated — person_id stays null */ }

        // entity_id from URL segment or response body
        const bodyData = (body as { data?: { id?: unknown; person_id?: unknown; audit_id?: unknown } })?.data
        const entity_id =
          (segments[1] && !isNaN(Number(segments[1])) ? segments[1] : null) ??
          (bodyData && typeof bodyData === 'object' ? String((bodyData as Record<string, unknown>)[`${entity}_id`] ?? '') || null : null)

        const ip =
          (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ??
          req.socket?.remoteAddress ??
          null

        // Strip password from logged metadata
        const rawBody = { ...req.body }
        delete rawBody.password
        delete rawBody.confirmPassword
        delete rawBody.token

        auditService.log({
          person_id,
          action,
          entity,
          entity_id: entity_id || null,
          description: `${req.method} ${req.originalUrl}`,
          metadata: Object.keys(rawBody).length ? rawBody : null,
          ip,
        }).catch(() => { /* never throw from audit */ })
      } catch { /* never throw from audit */ }
    }

    return originalJson(body)
  }

  next()
}
