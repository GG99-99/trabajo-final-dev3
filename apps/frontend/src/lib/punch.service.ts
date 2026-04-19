import { api } from './api'

export type PunchRecord = {
  worker_id: number
  attendance_id: number
  start: string
  close: string | null
  alert: boolean
  alert_text: string | null
  is_deleted: boolean
  worker: {
    worker_id: number
    person: { first_name: string; last_name: string; email: string }
  }
  attendance: { attendance_id: number; day: string; work_date: string }
}

export type TodayStatus = {
  clocked_in: boolean
  clocked_out: boolean
  assist: PunchRecord | null
}

export const punchService = {
  /** GET /api/punch/status?worker_id= */
  getTodayStatus: (worker_id: number) =>
    api.get<TodayStatus>('/punch/status', { worker_id }),

  /** GET /api/punch/history */
  getHistory: (filters?: { worker_id?: number; date?: string }) =>
    api.get<PunchRecord[]>('/punch/history', filters as Record<string, unknown>),

  /** POST /api/punch/in */
  clockIn: (worker_id: number) =>
    api.post<PunchRecord>('/punch/in', { worker_id }),

  /** POST /api/punch/out */
  clockOut: (worker_id: number) =>
    api.post<PunchRecord>('/punch/out', { worker_id }),
}

export type Fingerprint = {
  fingerprint_id: number
  worker_id: number
  template: string
  finger_index: number
  created_at: string
  updated_at: string
}

export type FingerprintWithWorker = Fingerprint & {
  worker: { worker_id: number; person: { first_name: string; last_name: string } }
}

export const fingerprintService = {
  /** GET /api/fingerprints */
  getAll: () => api.get<FingerprintWithWorker[]>('/fingerprints'),

  /** GET /api/fingerprints/detail?worker_id= */
  getByWorker: (worker_id: number) =>
    api.get<Fingerprint | null>('/fingerprints/detail', { worker_id }),

  /** GET /api/fingerprints/missing */
  getMissing: () =>
    api.get<{ worker_id: number; person: { first_name: string; last_name: string } }[]>('/fingerprints/missing'),

  /** POST /api/fingerprints */
  upsert: (worker_id: number, template: string, finger_index = 0) =>
    api.post<Fingerprint>('/fingerprints', { worker_id, template, finger_index }),

  /** DELETE /api/fingerprints/:worker_id */
  delete: (worker_id: number) =>
    api.delete<boolean>(`/fingerprints/${worker_id}`),

  /**
   * POST http://localhost:5100/identify
   * Sends all stored templates to the .NET service for 1:N matching.
   * Returns the matched worker_id or null.
   */
  identify: async (templates: { worker_id: number; template: string }[]): Promise<{ ok: boolean; worker_id: number | null; score: number; error?: string }> => {
    try {
      const res = await fetch('http://localhost:5100/identify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templates }),
      })
      return res.json()
    } catch {
      return { ok: false, worker_id: null, score: 0, error: 'Device service unavailable' }
    }
  },
}
