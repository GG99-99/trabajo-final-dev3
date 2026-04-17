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

async function request<T>(path: string, options?: RequestInit): Promise<ApiResponse<T>> {
  const res = await fetch(`${BASE_URL}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  })
  return res.json() as Promise<ApiResponse<T>>
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
