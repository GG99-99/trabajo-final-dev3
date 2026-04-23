import axios from 'axios'

/** Base URL de la API (incluye `/api`), p. ej. `http://localhost:3030/api` */
export function getApiBaseUrl(): string {
  const base = import.meta.env.VITE_API_URL ?? 'http://localhost:3030/api'
  return base.replace(/\/+$/, '')
}

/** Health bajo `/api/health`. */
export async function checkApiHealth(): Promise<boolean> {
  try {
    const { data, status } = await axios.get<{ ok?: boolean }>(`${getApiBaseUrl()}/health`, {
      timeout: 5000,
      withCredentials: true,
    })
    return status === 200 && data?.ok === true
  } catch {
    return false
  }
}
