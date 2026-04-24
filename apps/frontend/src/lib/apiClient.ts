import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Cache en localStorage ─────────────────────────────────────────────────

const CACHE_PREFIX = 'axios_cache:'
const CACHE_TTL_MS = 10 * 60 * 1000  // 10 minutos

function cacheKey(url: string): string {
  return CACHE_PREFIX + url
}

function readCache(url: string): unknown | null {
  try {
    const raw = localStorage.getItem(cacheKey(url))
    if (!raw) return null
    const { data, savedAt } = JSON.parse(raw) as { data: unknown; savedAt: number }
    if (Date.now() - savedAt > CACHE_TTL_MS) {
      localStorage.removeItem(cacheKey(url))
      return null
    }
    return data
  } catch {
    return null
  }
}

function writeCache(url: string, data: unknown): void {
  try {
    localStorage.setItem(cacheKey(url), JSON.stringify({ data, savedAt: Date.now() }))
  } catch { /* localStorage lleno */ }
}

// ─── Interceptors ───────────────────────────────────────────────────

// Interceptor request: añade token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Interceptor response: guarda GET exitosos en cache
apiClient.interceptors.response.use(
  (res) => {
    // Solo cacheamos GETs exitosos
    if (res.config.method?.toUpperCase() === 'GET' && res.data?.ok) {
      const url = res.config.url ?? ''
      const params = res.config.params ? '?' + new URLSearchParams(res.config.params).toString() : ''
      writeCache(url + params, res.data)
    }
    return res
  },
  (error) => {
    if (error.response?.status === 401) {
      // redirigir a login
    }

    // Error de red (backend caído) — intentamos devolver cache
    const isNetworkErr = !error.response && (error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED' || error.message === 'Network Error')
    if (isNetworkErr) {
      const url = error.config?.url ?? ''
      const params = error.config?.params ? '?' + new URLSearchParams(error.config.params).toString() : ''
      const cached = readCache(url + params)
      if (cached) {
        console.warn(`[apiClient] backend no disponible — usando cache para: ${url}`)
        // Devolvemos como respuesta válida con flag _stale
        return Promise.resolve({
          data: { ...(cached as object), _stale: true },
          status: 200,
          statusText: 'OK (cached)',
          headers: {},
          config: error.config,
        })
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;