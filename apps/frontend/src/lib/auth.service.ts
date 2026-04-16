import type { LoginData, PersonForCreate, UserCredentials } from '@final/shared'
import { api } from './api'

export const authService = {
  /** POST /api/login */
  login: (data: LoginData) =>
    api.post<UserCredentials>('/login', data),

  /** POST /api/register */
  register: (data: PersonForCreate) =>
    api.post<boolean>('/register', data),
}
