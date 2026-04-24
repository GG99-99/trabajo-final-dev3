/**
 * cache.ts
 * Helpers genéricos de cache en Redis con soporte de stale-while-revalidate.
 *
 * Patrón:
 *   1. Busca en Redis.
 *   2. Si hay hit → devuelve el valor cacheado.
 *   3. Si hay miss → llama al fn(), guarda en Redis, devuelve resultado.
 *   4. Si fn() falla y existe un stale (dato expirado) → devuelve stale con aviso.
 */

import { safeRedis } from './redis.js'

/** Prefijos de clave estándar para cada módulo */
export const CK = {
  AUTH_TOKEN:     (id: string)             => `auth:token:${id}`,
  PRODUCTS:       (filters: string)        => `products:${filters}`,
  PRODUCT:        (id: number)             => `product:${id}`,
  CATEGORIES:     ()                       => `categories:all`,
  CATEGORY:       (id: number)             => `category:${id}`,
  APT_BLOCKS:     (date: string, wid: number) => `apt:blocks:${date}:${wid}`,
  SCHEDULE:       (wid: number)            => `schedule:active:${wid}`,
  WORKERS:        ()                       => `workers:all`,
  WORKER:         (id: number)             => `worker:${id}`,
  SEATS:          ()                       => `seats:all`,
  CASHIER_STATUS: (id: number)             => `cashier:status:${id}`,
  INVENTORY:      ()                       => `inventory:all`,
  PROVIDERS:      ()                       => `providers:all`,
  PROVIDER:       (id: number)             => `provider:${id}`,
  CLIENTS:        ()                       => `clients:all`,
  CLIENT:         (id: number)             => `client:${id}`,
  PVARIANT:       (id: number)             => `pvariant:${id}`,
  PVARIANTS:      (filters: string)        => `pvariants:${filters}`,
  AUDIT_QUEUE:    ()                       => `audit:write_queue`,
} as const

/** TTLs en segundos */
export const TTL = {
  SHORT:    60,        // 1 min  – bloques de citas (cambian frecuente)
  MEDIUM:   300,       // 5 min  – schedules, workers
  LONG:     600,       // 10 min – catálogos de productos, categorías
  AUTH:     3600,      // 1 h    – tokens JWT
} as const

const STALE_SUFFIX = ':stale'

/**
 * Obtiene datos con cache-aside + stale fallback.
 * Si el core cae y hay dato stale, lo devuelve en vez de lanzar error.
 */
export async function withCache<T>(
  key: string,
  ttl: number,
  fn: () => Promise<T>,
): Promise<T> {
  // Intento leer de cache
  const cached = await safeRedis(r => r.get(key), null)
  if (cached) {
    try { return JSON.parse(cached) as T } catch { /* corrupto, sigue */ }
  }

  try {
    const result = await fn()
    // Guardar en Redis (normal + stale backup)
    const serialized = JSON.stringify(result)
    await safeRedis(async r => {
      await r.setex(key, ttl, serialized)
      await r.setex(key + STALE_SUFFIX, ttl * 6, serialized)  // stale vive 6x más
    }, undefined)
    return result
  } catch (err: any) {
    // El core falló — intenta stale
    const stale = await safeRedis(r => r.get(key + STALE_SUFFIX), null)
    if (stale) {
      try {
        console.warn(`[cache] usando stale para '${key}'`)
        return JSON.parse(stale) as T
      } catch { /* stale corrupto */ }
    }
    throw err
  }
}

/** Invalida una clave de cache (y su stale) */
export async function invalidateCache(...keys: string[]): Promise<void> {
  await safeRedis(async r => {
    const toDelete = keys.flatMap(k => [k, k + STALE_SUFFIX])
    if (toDelete.length > 0) await r.del(...toDelete)
  }, undefined)
}

/** Invalida todas las claves que coincidan con un patrón (usa con cuidado en prod) */
export async function invalidatePattern(pattern: string): Promise<void> {
  await safeRedis(async r => {
    const keys = await r.keys(pattern)
    if (keys.length > 0) await r.del(...keys)
  }, undefined)
}
