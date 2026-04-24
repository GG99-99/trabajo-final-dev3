/**
 * api.ts — Cliente HTTP del frontend
 *
 * El Service Worker (sw.js) intercepta todas las peticiones fetch y se
 * encarga de:
 *   - Cachear GETs exitosos en IndexedDB (mini-replica del core)
 *   - Servir desde cache cuando el core no responde
 *   - Encolar POST/PUT/DELETE cuando el core no responde
 *
 * Este módulo es un wrapper delgado que solo añade el token de auth
 * y normaliza las respuestas. No necesita lógica de cache propia.
 */

import type { ApiResponse } from '@final/shared'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3030/api'

function buildQuery(params?: Record<string, unknown>): string {
  if (!params) return ''
  const q = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null) q.set(k, String(v))
  }
  const s = q.toString()
  return s ? `?${s}` : ''
}

function getToken(): string | null {
  return typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null
}

async function request<T>(path: string, options?: RequestInit): Promise<ApiResponse<T>> {
  const token = getToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options?.headers as Record<string, string> ?? {}),
  }
  if (token) headers['Authorization'] = `Bearer ${token}`

  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      credentials: 'include',
      ...options,
      headers,
    })

    // El SW puede devolver 202 cuando encola una escritura offline
    const json = await res.json() as ApiResponse<T>
    return json
  } catch (err) {
    // Esto solo ocurre si el SW tampoco está disponible (muy raro)
    return {
      ok: false,
      data: null as T,
      error: {
        name: 'NetworkError',
        statusCode: 0,
        message: 'Sin conexión con el servidor.',
      },
    } as ApiResponse<T>
  }
}

export const api = {
  get: <T>(path: string, params?: Record<string, unknown>) =>
    request<T>(path + buildQuery(params)),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
  delete: <T>(path: string) =>
    request<T>(path, { method: 'DELETE' }),
}
