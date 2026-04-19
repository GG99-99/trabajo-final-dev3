import { useState, useEffect, useRef } from 'react'
import {
  Clock, CheckCircle, XCircle, Fingerprint,
  AlertTriangle, LogIn, LogOut, FlaskConical, Cpu
} from 'lucide-react'
import { punchService, fingerprintService, type TodayStatus, type FingerprintWithWorker } from '@/lib/punch.service'
import { workerService } from '@/lib/people.service'
import type { WorkerPublic } from '@final/shared'

// ── helpers ────────────────────────────────────────────────────────────────
const pad = (n: number) => String(n).padStart(2, '0')
const fmtTime = (iso: string) => {
  const d = new Date(iso)
  const h = d.getHours(), m = d.getMinutes(), s = d.getSeconds()
  const period = h >= 12 ? 'PM' : 'AM'
  return `${h % 12 || 12}:${pad(m)}:${pad(s)} ${period}`
}

type FpState = 'idle' | 'scanning' | 'matched' | 'no_match' | 'error' | 'no_device'
type Mode    = 'test' | 'real'

const FP_LABELS: Record<FpState, string> = {
  idle:      'Place finger on reader',
  scanning:  'Scanning...',
  matched:   'Identity confirmed ✓',
  no_match:  'No match — try again',
  error:     'Scan error',
  no_device: 'Device offline — manual mode',
}
const FP_COLORS: Record<FpState, string> = {
  idle:      'text-white/20',
  scanning:  'text-yellow-400 animate-pulse',
  matched:   'text-emerald-400',
  no_match:  'text-red-400',
  error:     'text-red-400',
  no_device: 'text-white/20',
}

// ── component ──────────────────────────────────────────────────────────────
export default function PunchStation() {
  const [time, setTime]         = useState(new Date())
  const [mode, setMode]         = useState<Mode>('test')

  // test mode
  const [workers, setWorkers]   = useState<WorkerPublic[]>([])
  const [selWorker, setSelWorker] = useState<number | ''>('')

  // real mode — identified via fingerprint
  const [allFps, setAllFps]     = useState<FingerprintWithWorker[]>([])
  const [identifiedWorker, setIdentifiedWorker] = useState<WorkerPublic | null>(null)

  const [status, setStatus]     = useState<TodayStatus | null>(null)
  const [statusLoading, setStatusLoading] = useState(false)
  const [fpState, setFpState]   = useState<FpState>('idle')
  const [message, setMessage]   = useState<{ type: 'ok' | 'error' | 'warn'; text: string } | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Live clock
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  // Load workers + all fingerprints on mount
  useEffect(() => {
    workerService.getAll().then(r => { if (r.ok) setWorkers(r.data) })
    fingerprintService.getAll().then(r => { if (r.ok) setAllFps(r.data) })
  }, [])

  // Load status when active worker changes
  const activeWorkerId = mode === 'test'
    ? (selWorker ? Number(selWorker) : null)
    : (identifiedWorker?.worker_id ?? null)

  useEffect(() => {
    if (!activeWorkerId) { setStatus(null); return }
    loadStatus(activeWorkerId)
  }, [activeWorkerId])

  // Reset identified worker when switching modes
  useEffect(() => {
    setIdentifiedWorker(null)
    setStatus(null)
    setFpState('idle')
    setMessage(null)
  }, [mode])

  async function loadStatus(worker_id: number) {
    setStatusLoading(true)
    const res = await punchService.getTodayStatus(worker_id)
    if (res.ok) setStatus(res.data)
    setStatusLoading(false)
  }

  const flash = (type: 'ok' | 'error' | 'warn', text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 5000)
  }

  const resetFpState = (delay = 3000) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setFpState('idle'), delay)
  }

  // ── Real mode: identify worker via 1:N fingerprint scan ──────────────────
  async function identifyWorker(): Promise<number | null> {
    if (allFps.length === 0) {
      flash('warn', 'No fingerprints registered in the system.')
      return null
    }

    setFpState('scanning')
    setIdentifiedWorker(null)
    setStatus(null)

    const templates = allFps.map(fp => ({
      worker_id: fp.worker_id,
      template:  fp.template,
    }))

    const result = await fingerprintService.identify(templates)

    if (!result.ok || result.worker_id === null) {
      if (result.error?.includes('unavailable')) {
        setFpState('no_device')
        flash('warn', 'Fingerprint device not available. Switch to Test mode.')
      } else {
        setFpState('no_match')
        flash('error', 'Fingerprint not recognized. Please try again.')
      }
      resetFpState()
      return null
    }

    setFpState('matched')
    const worker = workers.find(w => w.worker_id === result.worker_id) ?? null
    setIdentifiedWorker(worker)
    resetFpState(4000)
    return result.worker_id
  }

  // ── Test mode: verify fingerprint for selected worker ────────────────────
  async function verifySelectedWorker(): Promise<boolean> {
    if (!selWorker) return false
    setFpState('scanning')

    try {
      const fpRes = await fingerprintService.getByWorker(Number(selWorker))
      if (!fpRes.ok || !fpRes.data) {
        setFpState('no_device')
        flash('warn', 'No fingerprint registered for this worker. Proceeding in test mode.')
        resetFpState()
        return true // allow in test mode even without fingerprint
      }

      const scanRes = await fetch('http://localhost:5100/scan', { method: 'POST' })
      if (!scanRes.ok) throw new Error('Device error')
      const scanData = await scanRes.json()

      const verifyRes = await fetch('http://localhost:5100/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stored_template: fpRes.data.template, live_template: scanData.template }),
      })
      const verifyData = await verifyRes.json()

      if (verifyData.match) {
        setFpState('matched')
        resetFpState()
        return true
      } else {
        setFpState('no_match')
        flash('error', 'Fingerprint does not match.')
        resetFpState()
        return false
      }
    } catch {
      // Device offline in test mode — allow punch anyway
      setFpState('no_device')
      flash('warn', 'Device offline. Proceeding without fingerprint verification.')
      resetFpState()
      return true
    }
  }

  // ── Clock In ──────────────────────────────────────────────────────────────
  async function handleClockIn() {
    let worker_id: number | null = null

    if (mode === 'real') {
      worker_id = await identifyWorker()
      if (!worker_id) return
    } else {
      if (!selWorker) { flash('error', 'Select a worker first.'); return }
      const ok = await verifySelectedWorker()
      if (!ok) return
      worker_id = Number(selWorker)
    }

    setSubmitting(true)
    const res = await punchService.clockIn(worker_id)
    setSubmitting(false)
    if (!res.ok) { flash('error', res.error.message); return }
    flash('ok', `Clock-in registered at ${fmtTime(res.data.start)}`)
    loadStatus(worker_id)
  }

  // ── Clock Out ─────────────────────────────────────────────────────────────
  async function handleClockOut() {
    let worker_id: number | null = null

    if (mode === 'real') {
      worker_id = await identifyWorker()
      if (!worker_id) return
    } else {
      if (!selWorker) { flash('error', 'Select a worker first.'); return }
      const ok = await verifySelectedWorker()
      if (!ok) return
      worker_id = Number(selWorker)
    }

    setSubmitting(true)
    const res = await punchService.clockOut(worker_id)
    setSubmitting(false)
    if (!res.ok) { flash('error', res.error.message); return }
    flash('ok', `Clock-out registered at ${fmtTime(res.data.close!)}`)
    loadStatus(worker_id)
  }

  const activeWorker = mode === 'test'
    ? workers.find(w => w.worker_id === Number(selWorker))
    : identifiedWorker

  const canClockIn  = status && !status.clocked_in
  const canClockOut = status && status.clocked_in && !status.clocked_out
  const isScanning  = fpState === 'scanning'

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 selection:bg-[#ff5a66]/20">
      <div className="w-full max-w-md space-y-6">

        {/* Clock */}
        <div className="text-center">
          <p className="text-[56px] font-light text-white/90 leading-none tabular-nums"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            {time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit' })}
          </p>
          <p className="text-[11px] uppercase tracking-[0.3em] text-white/30 mt-2">
            {time.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        {/* Mode toggle */}
        <div className="flex items-center justify-center">
          <div className="flex items-center bg-[#1a1a1a] border border-white/10 rounded-sm p-1 gap-1">
            <button
              onClick={() => setMode('test')}
              className={`flex items-center gap-2 px-4 py-2 rounded-sm text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${
                mode === 'test'
                  ? 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30'
                  : 'text-white/30 hover:text-white/60'
              }`}
            >
              <FlaskConical className="w-3.5 h-3.5" />
              Test
            </button>
            <button
              onClick={() => setMode('real')}
              className={`flex items-center gap-2 px-4 py-2 rounded-sm text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${
                mode === 'real'
                  ? 'bg-[#ff5a66]/15 text-[#ff5a66] border border-[#ff5a66]/30'
                  : 'text-white/30 hover:text-white/60'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              Real
            </button>
          </div>
        </div>

        {/* Mode description */}
        <p className="text-center text-[10px] text-white/20 uppercase tracking-[0.2em]">
          {mode === 'test'
            ? 'Test mode — select worker manually'
            : 'Real mode — identity via fingerprint reader'}
        </p>

        {/* Card */}
        <div className="bg-[#1a1a1a] border border-white/10 rounded-sm p-8 space-y-6">

          {/* Test mode: worker selector */}
          {mode === 'test' && (
            <div>
              <label className="block text-[9px] font-semibold uppercase tracking-[0.3em] text-white/30 mb-2">
                Select Worker
              </label>
              <select
                value={selWorker}
                onChange={e => setSelWorker(e.target.value ? Number(e.target.value) : '')}
                className="w-full bg-[#0a0a0a] border border-white/10 text-white/80 text-[13px] px-3 py-2.5 rounded-sm outline-none focus:border-[#ff5a66] cursor-pointer [&>option]:bg-[#1a1a1a]"
              >
                <option value="">Select your name...</option>
                {workers.map(w => (
                  <option key={w.worker_id} value={w.worker_id}>
                    {w.first_name} {w.last_name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Real mode: identified worker display */}
          {mode === 'real' && identifiedWorker && (
            <div className="flex items-center gap-3 px-4 py-3 bg-emerald-500/8 border border-emerald-500/20 rounded-sm">
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <p className="text-[13px] text-white/90 font-medium">
                  {identifiedWorker.first_name} {identifiedWorker.last_name}
                </p>
                <p className="text-[10px] text-white/30 uppercase tracking-[0.15em]">
                  {identifiedWorker.specialty}
                </p>
              </div>
            </div>
          )}

          {/* Today status */}
          {activeWorkerId && !statusLoading && status && (
            <div className="bg-black/40 border border-white/8 rounded-sm px-4 py-3 space-y-2">
              <p className="text-[9px] uppercase tracking-[0.3em] text-white/25 mb-2">Today's Status</p>
              <div className="flex items-center gap-2">
                {status.clocked_in
                  ? <CheckCircle className="w-4 h-4 text-emerald-400" />
                  : <XCircle    className="w-4 h-4 text-white/20" />}
                <span className="text-[12px] text-white/70">
                  Clock-in: {status.assist ? fmtTime(status.assist.start) : '—'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {status.clocked_out
                  ? <CheckCircle className="w-4 h-4 text-[#ff5a66]" />
                  : <XCircle    className="w-4 h-4 text-white/20" />}
                <span className="text-[12px] text-white/70">
                  Clock-out: {status.assist?.close ? fmtTime(status.assist.close) : '—'}
                </span>
              </div>
            </div>
          )}

          {/* Fingerprint indicator */}
          <div className="flex items-center justify-center gap-3 py-2">
            <Fingerprint className={`w-8 h-8 transition-colors ${FP_COLORS[fpState]}`} />
            <span className="text-[11px] text-white/30">{FP_LABELS[fpState]}</span>
          </div>

          {/* Message */}
          {message && (
            <div className={`flex items-start gap-2.5 px-4 py-3 rounded-sm border text-[12px] ${
              message.type === 'ok'   ? 'bg-emerald-500/8 border-emerald-500/20 text-emerald-400' :
              message.type === 'warn' ? 'bg-yellow-500/8 border-yellow-500/20 text-yellow-400' :
                                        'bg-red-500/8 border-red-500/20 text-red-400'
            }`}>
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <p>{message.text}</p>
            </div>
          )}

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleClockIn}
              disabled={
                isScanning || submitting ||
                (mode === 'test' && (!selWorker || !canClockIn)) ||
                (mode === 'real' && (!!identifiedWorker && !canClockIn))
              }
              className="h-14 flex flex-col items-center justify-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <LogIn className="w-5 h-5" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Clock In</span>
            </button>
            <button
              onClick={handleClockOut}
              disabled={
                isScanning || submitting ||
                (mode === 'test' && (!selWorker || !canClockOut)) ||
                (mode === 'real' && (!!identifiedWorker && !canClockOut))
              }
              className="h-14 flex flex-col items-center justify-center gap-1 bg-[#ff5a66] hover:bg-[#ff7078] text-black rounded-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Clock Out</span>
            </button>
          </div>

          {activeWorker && (
            <p className="text-center text-[10px] text-white/20 uppercase tracking-[0.2em]">
              {activeWorker.first_name} {activeWorker.last_name}
              {activeWorker.specialty ? ` · ${activeWorker.specialty}` : ''}
            </p>
          )}
        </div>

        <p className="text-center text-[9px] uppercase tracking-[0.3em] text-white/10">
          Obsidian Archive · Internal Terminal
        </p>
      </div>
    </div>
  )
}
