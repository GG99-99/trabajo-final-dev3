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

/**
 * Detecta si un error es de red (core caído, sin conexión, timeout).
 * En ese caso NO lanzamos — devolvemos un ApiResponse con ok: false
 * para que el caller pueda manejarlo sin try/catch obligatorio.
 */
function networkErrorResponse<T>(err: unknown): ApiResponse<T> {
  const isNetwork =
    err instanceof TypeError ||
    (err instanceof Error && (
      err.message.includes('fetch') ||
      err.message.includes('network') ||
      err.message.includes('ECONNREFUSED')
    ))

  return {
    ok: false,
    data: null as T,
    error: {
      name: isNetwork ? 'NetworkError' : 'UnknownError',
      statusCode: 0,
      message: isNetwork
        ? 'No se puede conectar con el servidor. Verifica tu conexión.'
        : String(err),
    },
  } as ApiResponse<T>
}

async function request<T>(path: string, options?: RequestInit): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', ...options?.headers },
      ...options,
    })
    return res.json() as Promise<ApiResponse<T>>
  } catch (err) {
    // Error de red — nunca lanzamos, siempre devolvemos ApiResponse
    return networkErrorResponse<T>(err)
  }
}

export const api = {
  get:    <T>(path: string, params?: Record<string, unknown>) =>
    request<T>(path + buildQuery(params)),
  post:   <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  put:    <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'PUT',  body: JSON.stringify(body) }),
  delete: <T>(path: string) =>
    request<T>(path, { method: 'DELETE' }),
}
