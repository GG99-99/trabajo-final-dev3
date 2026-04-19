import type { LoginData, CreatePerson, UserCredentials } from '@final/shared'
import { api } from './api'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3030/api'

export interface AdminTokens {
  tokenWorker:  { value: string; expiresAt: number }
  tokenCashier: { value: string; expiresAt: number }
}

export const authService = {
  /** POST /api/auth/login */
  login: (data: LoginData) =>
    api.post<UserCredentials>('/auth/login', data),

  /**
   * Register: POST /api/auth/register with x-registration-token header.
   * The token comes from the admin panel, not auto-fetched anymore.
   */
  register: async (data: CreatePerson & { token: string }) => {
    const { token, ...personData } = data
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'x-registration-token': token,
      },
      body: JSON.stringify(personData),
    })
    return res.json()
  },

  /**
   * Check if email is available (not already registered).
   * Uses GET /api/persons/detail — if a person is found, email is taken.
   */
  checkEmailAvailable: async (email: string): Promise<{ ok: boolean; error?: { message: string } }> => {
    const res = await api.get<{ person_id: number } | null>('/persons/detail', { email, noPass: true } as Record<string, unknown>)
    if (res.ok && res.data) {
      return { ok: false, error: { message: 'Este correo ya está registrado.' } }
    }
    return { ok: true }
  },

  /** GET /api/auth/token — validate current JWT cookie */
  validateToken: () =>
    api.get<UserCredentials>('/auth/token'),

  /** GET /api/auth/admin/tokens — get current registration tokens (admin only) */
  getAdminTokens: () =>
    api.get<AdminTokens>('/auth/admin/tokens'),

  /** POST /api/auth/admin/tokens/refresh — force-regenerate tokens (admin only) */
  refreshAdminTokens: () =>
    api.post<AdminTokens>('/auth/admin/tokens/refresh', {}),
}
