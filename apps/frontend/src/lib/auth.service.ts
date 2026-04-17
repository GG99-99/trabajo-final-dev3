import type { LoginData, PersonForCreate, UserCredentials } from '@final/shared'
import { api } from './api'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3030/api'

export const authService = {
  /** POST /api/auth/login */
  login: (data: LoginData) =>
    api.post<UserCredentials>('/auth/login', data),

  /**
   * Register flow:
   * 1. GET /api/auth/register  → obtiene x-registration-token
   * 2. POST /api/auth/register → crea el usuario con ese token en el header
   */
  register: async (data: PersonForCreate) => {
    // Step 1: get the registration token
    const tokenRes = await fetch(`${BASE_URL}/auth/register`, {
      credentials: 'include',
    })
    const tokenJson = await tokenRes.json()
    if (!tokenJson.ok) return tokenJson as { ok: false; data: null; error: { message: string; name: string; statusCode: number } }

    // Step 2: register with the token
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'x-registration-token': tokenJson.data?.token ?? '',
      },
      body: JSON.stringify(data),
    })
    return res.json()
  },

  /** GET /api/auth/token — validate current JWT cookie */
  validateToken: () =>
    api.get<UserCredentials>('/auth/token'),
}
