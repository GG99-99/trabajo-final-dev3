/**
 * sw.js — Service Worker de Resiliencia (Capa de Integración Resiliente)
 *
 * Intercepta TODAS las peticiones al core (backend).
 * ┌─────────────────────────────────────────────────────────────────┐
 * │  GET  → intenta core → guarda en IDB → si falla sirve desde IDB │
 * │  POST/PUT/DELETE → intenta core → si falla encola en IDB         │
 * │  Cola → se drena automáticamente cuando el core vuelve           │
 * │  Health-check activo cada 10s → notifica CORE_STATUS a la UI    │
 * └─────────────────────────────────────────────────────────────────┘
 */

const DB_NAME     = 'cir_db'
const DB_VERSION  = 1
const STORE_CACHE = 'response_cache'
const STORE_QUEUE = 'write_queue'
const CORE_ORIGIN = 'http://localhost:3030'
const CACHE_TTL   = 30 * 60 * 1000
const POLL_MS     = 10_000   // health-check cada 10s (antes 20s, era demasiado lento)

// Estado interno del core — evita notificar si no cambió nada
let _coreAlive = true

// ─── IndexedDB helpers ────────────────────────────────────────────────────────

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = (e) => {
      const db = e.target.result
      if (!db.objectStoreNames.contains(STORE_CACHE)) {
        const s = db.createObjectStore(STORE_CACHE, { keyPath: 'key' })
        s.createIndex('savedAt', 'savedAt')
      }
      if (!db.objectStoreNames.contains(STORE_QUEUE)) {
        db.createObjectStore(STORE_QUEUE, { keyPath: 'id', autoIncrement: true })
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror   = () => reject(req.error)
  })
}

async function idbGet(store, key) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx  = db.transaction(store, 'readonly')
    const req = tx.objectStore(store).get(key)
    req.onsuccess = () => resolve(req.result ?? null)
    req.onerror   = () => reject(req.error)
  })
}

async function idbPut(store, value) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx  = db.transaction(store, 'readwrite')
    const req = tx.objectStore(store).put(value)
    req.onsuccess = () => resolve(req.result)
    req.onerror   = () => reject(req.error)
  })
}

async function idbDelete(store, key) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx  = db.transaction(store, 'readwrite')
    const req = tx.objectStore(store).delete(key)
    req.onsuccess = () => resolve()
    req.onerror   = () => reject(req.error)
  })
}

async function idbGetAll(store) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx  = db.transaction(store, 'readonly')
    const req = tx.objectStore(store).getAll()
    req.onsuccess = () => resolve(req.result ?? [])
    req.onerror   = () => reject(req.error)
  })
}

// ─── Cache helpers ────────────────────────────────────────────────────────────

function cacheKeyFor(url) {
  try {
    const u = new URL(url)
    return u.pathname + u.search
  } catch {
    return url
  }
}

async function saveToCache(url, responseData) {
  await idbPut(STORE_CACHE, {
    key:     cacheKeyFor(url),
    url,
    data:    responseData,
    savedAt: Date.now(),
  })
}

async function loadFromCache(url) {
  const key    = cacheKeyFor(url)
  const record = await idbGet(STORE_CACHE, key)
  if (!record) return null
  if (Date.now() - record.savedAt > CACHE_TTL) {
    await idbDelete(STORE_CACHE, key)
    return null
  }
  return record.data
}

// ─── Write queue ──────────────────────────────────────────────────────────────

async function enqueueWrite(request, bodyText) {
  await idbPut(STORE_QUEUE, {
    url:        request.url,
    method:     request.method,
    headers:    Object.fromEntries(request.headers.entries()),
    body:       bodyText,
    enqueuedAt: Date.now(),
    retries:    0,
  })
  console.log(`[SW] encolado: ${request.method} ${request.url}`)
  const queue = await idbGetAll(STORE_QUEUE)
  notifyClients({ type: 'QUEUE_UPDATE', pendingCount: queue.length })
}

async function drainQueue() {
  const items = await idbGetAll(STORE_QUEUE)
  if (items.length === 0) return

  const alive = await isCoreAlive()
  if (!alive) return

  console.log(`[SW] drenando cola: ${items.length} items`)

  for (const item of items) {
    try {
      const res = await fetch(item.url, {
        method:      item.method,
        headers:     item.headers,
        body:        item.body || undefined,
        credentials: 'include',
      })
      if (res.ok || res.status < 500) {
        await idbDelete(STORE_QUEUE, item.id)
        console.log(`[SW] sincronizado: ${item.method} ${item.url} → ${res.status}`)
      } else {
        throw new Error(`HTTP ${res.status}`)
      }
    } catch {
      item.retries = (item.retries || 0) + 1
      if (item.retries >= 10) {
        console.warn(`[SW] descartando item por exceder reintentos: ${item.url}`)
        await idbDelete(STORE_QUEUE, item.id)
      } else {
        await idbPut(STORE_QUEUE, item)
      }
      break
    }
  }

  const remaining = await idbGetAll(STORE_QUEUE)
  notifyClients({ type: 'QUEUE_UPDATE', pendingCount: remaining.length })
}

// ─── Health-check activo ──────────────────────────────────────────────────────
// Único lugar donde se llama a /api/health. Compara con el estado anterior
// y solo notifica a la UI cuando el estado CAMBIA (vivo→caído o caído→vivo).

async function isCoreAlive() {
  try {
    const res = await fetch(`${CORE_ORIGIN}/health`, {
      method: 'GET',
      cache:  'no-store',
      signal: AbortSignal.timeout(3000),
    })
    return res.ok
  } catch {
    return false
  }
}

async function runHealthCheck() {
  const alive = await isCoreAlive()
  const queue = await idbGetAll(STORE_QUEUE)

  if (alive !== _coreAlive) {
    // El estado cambió — notifica a todos los clientes
    _coreAlive = alive
    console.log(`[SW] core ${alive ? 'recuperado ✓' : 'caído ✗'}`)
    notifyClients({
      type:         'CORE_STATUS',
      alive,
      pendingCount: queue.length,
    })
  }

  // Si el core volvió, aprovecha para drenar la cola
  if (alive && queue.length > 0) {
    await drainQueue()
  }
}

// ─── Notificar a los clientes (UI) ───────────────────────────────────────────

async function notifyClients(message) {
  const clients = await self.clients.matchAll({ includeUncontrolled: true, type: 'window' })
  clients.forEach(client => client.postMessage(message))
}

// ─── Fetch intercept ──────────────────────────────────────────────────────────

self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = request.url

  if (!url.startsWith(CORE_ORIGIN)) return

  const method = request.method.toUpperCase()

  if (method === 'GET') {
    event.respondWith(handleGet(request))
  } else if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    event.respondWith(handleWrite(request))
  }
})

async function handleGet(request) {
  try {
    const response = await fetch(request.clone())

    if (response.ok) {
      // Core vivo: actualiza estado si estaba marcado como caído
      if (!_coreAlive) {
        _coreAlive = true
        const queue = await idbGetAll(STORE_QUEUE)
        notifyClients({ type: 'CORE_STATUS', alive: true, pendingCount: queue.length })
        drainQueue()
      }
      const cloned = response.clone()
      cloned.json().then(data => saveToCache(request.url, data)).catch(() => {})
    }

    return response
  } catch {
    // Core caído: actualiza estado si estaba marcado como vivo
    if (_coreAlive) {
      _coreAlive = false
      const queue = await idbGetAll(STORE_QUEUE)
      notifyClients({ type: 'CORE_STATUS', alive: false, pendingCount: queue.length })
    }

    const cached = await loadFromCache(request.url)
    if (cached) {
      console.warn(`[SW] sirviendo desde cache: ${request.url}`)
      return new Response(JSON.stringify({ ...cached, _stale: true, _offline: true }), {
        status:  200,
        headers: { 'Content-Type': 'application/json', 'X-CIR-Stale': 'true' },
      })
    }

    return new Response(JSON.stringify({
      ok: false,
      data: null,
      _offline: true,
      error: { name: 'ServiceUnavailable', statusCode: 503, message: 'El servidor no está disponible. Intenta más tarde.' },
    }), {
      status:  503,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

async function handleWrite(request) {
  let bodyText = ''
  try { bodyText = await request.clone().text() } catch { /* sin body */ }

  try {
    const response = await fetch(request.clone())

    // Core vivo: actualiza estado si estaba marcado como caído
    if (!_coreAlive) {
      _coreAlive = true
      const queue = await idbGetAll(STORE_QUEUE)
      notifyClients({ type: 'CORE_STATUS', alive: true, pendingCount: queue.length })
      drainQueue()
    }

    return response
  } catch {
    // Core caído: actualiza estado si estaba marcado como vivo
    if (_coreAlive) {
      _coreAlive = false
      const queue = await idbGetAll(STORE_QUEUE)
      notifyClients({ type: 'CORE_STATUS', alive: false, pendingCount: queue.length })
    }

    await enqueueWrite(request, bodyText)

    return new Response(JSON.stringify({
      ok:       true,
      data:     null,
      _queued:  true,
      _offline: true,
      message:  'Operación guardada. Se sincronizará cuando el servidor esté disponible.',
    }), {
      status:  202,
      headers: { 'Content-Type': 'application/json', 'X-CIR-Queued': 'true' },
    })
  }
}

// ─── Instalación y activación ─────────────────────────────────────────────────

self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()))

// ─── Mensajes desde la UI ─────────────────────────────────────────────────────

self.addEventListener('message', async (event) => {
  const { type } = event.data ?? {}

  switch (type) {
    case 'DRAIN_QUEUE':
      await drainQueue()
      break
    case 'GET_STATUS': {
      const queue = await idbGetAll(STORE_QUEUE)
      const cache = await idbGetAll(STORE_CACHE)
      event.source?.postMessage({
        type:         'STATUS',
        alive:        _coreAlive,
        pendingCount: queue.length,
        cacheCount:   cache.length,
        queue,
      })
      break
    }
    case 'CLEAR_CACHE': {
      const db = await openDB()
      await new Promise((res, rej) => {
        const tx  = db.transaction(STORE_CACHE, 'readwrite')
        const req = tx.objectStore(STORE_CACHE).clear()
        req.onsuccess = res
        req.onerror   = rej
      })
      break
    }
  }
})

// ─── Polling de health-check ──────────────────────────────────────────────────

setInterval(runHealthCheck, POLL_MS)
