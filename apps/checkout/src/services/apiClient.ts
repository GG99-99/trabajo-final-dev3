/**
 * apiClient.ts — Checkout
 *
 * Cliente HTTP base. El SW (sw.js) intercepta todas las peticiones al core:
 * - GETs: sirve desde IndexedDB si el core está caído
 * - POSTs/PUTs/etc: encola en IndexedDB para sincronizar luego
 *
 * Este interceptor solo maneja el token y los errores de negocio (4xx).
 * La resiliencia real (cache + cola) la hace el Service Worker, no axios.
 */

import axios from 'axios'

const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL ?? 'http://localhost:3030/api'}`,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ─── Auth token ───────────────────────────────────────────────────────────────

apiClient.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ─── Response ─────────────────────────────────────────────────────────────────

apiClient.interceptors.response.use(
  (response) => {
    // Marca visual opcional: el SW devolvió datos del cache
    if (response.headers?.['x-cir-stale']) {
      console.info('[apiClient] datos servidos desde cache local (core no disponible)')
    }
    // El SW encoló una escritura pendiente
    if (response.headers?.['x-cir-queued']) {
      console.info('[apiClient] operación encolada — se sincronizará cuando el core vuelva')
    }
    return response
  },
  (error) => {
    // 503 que viene del propio SW (sin cache disponible)
    if (error.response?.status === 503 && error.response?.data?._offline) {
      console.warn('[apiClient] core no disponible y sin cache para:', error.config?.url)
      return Promise.reject(error)
    }

    console.error('[apiClient] error:', error.message, {
      url:    error.config?.url,
      status: error.response?.status,
    })

    return Promise.reject(error)
  },
)

export default apiClient
