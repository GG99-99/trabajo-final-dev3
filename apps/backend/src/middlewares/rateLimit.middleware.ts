import rateLimit from 'express-rate-limit'
import type { Request, Response, NextFunction } from 'express'

// ── In-memory store: IP → { date, count } ─────────────────────────────────
// Tracks IPs that have successfully booked on a given date.
// Resets automatically since it's keyed by date string.
const bookingStore = new Map<string, { date: string; count: number }>()

function todayStr() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/** Call this after a successful booking to register the IP */
export function registerBooking(ip: string) {
  const today = todayStr()
  const entry = bookingStore.get(ip)
  if (!entry || entry.date !== today) {
    bookingStore.set(ip, { date: today, count: 1 })
  } else {
    entry.count++
  }
}

/** Middleware: block IPs that already booked today */
export function ipDailyBookingGuard(req: Request, res: Response, next: NextFunction) {
  const ip    = req.ip ?? 'unknown'
  const today = todayStr()
  const entry = bookingStore.get(ip)

  if (entry && entry.date === today && entry.count >= 1) {
    return res.status(429).json({
      ok: false,
      data: null,
      error: {
        name: 'TooManyRequests',
        statusCode: 429,
        message: 'Only one appointment per day is allowed from this location. Try again tomorrow.'
      }
    })
  }
  next()
}

// ── Attempt rate limiter: max 10 requests per 15 min per IP ───────────────
// Prevents brute-force / slot-scanning abuse
export const publicBookingLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: {
    ok: false,
    data: null,
    error: {
      name: 'TooManyRequests',
      statusCode: 429,
      message: 'Too many requests. Please slow down and try again in a few minutes.'
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip ?? 'unknown',
})
