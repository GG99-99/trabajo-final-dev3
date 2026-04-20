import { useState, useEffect, useRef } from 'react'
import {
  CheckCircle, XCircle, Fingerprint,
  AlertTriangle, LogIn, LogOut, FlaskConical, Cpu, WifiOff, Clock, RefreshCw
} from 'lucide-react'
import { punchService, fingerprintService, type TodayStatus, type FingerprintWithWorker } from '@/lib/punch.service'
import { workerService } from '@/lib/people.service'
import { getQueue, onQueueChange, type PendingTransaction } from '@/lib/punch.offline'
import type { WorkerPublic } from '@final/shared'

const pad = (n: number) => String(n).padStart(2, '0')
const fmtTime = (iso: string) => {
  const d = new Date(iso)
  const h = d.getHours(), m = d.getMinutes(), s = d.getSeconds()
  const period = h >= 12 ? 'PM' : 'AM'
  return `${h % 12 || 12}:${pad(m)}:${pad(s)} ${period}`
}

type FpState = 'idle' | 'waiting' | 'scanning' | 'matched' | 'no_match' | 'error' | 'no_device'
type Mode    = 'test' | 'real'

const FP_LABELS: Record<FpState, string> = {
  idle:      'Press a button to start',
  waiting:   'Place your finger on the reader...',
  scanning:  'Reading fingerprint...',
  matched:   'Identity confirmed ✓',
  no_match:  'No match — try again',
  error:     'Scan error',
  no_device: 'Device offline',
}
const FP_COLORS: Record<FpState, string> = {
  idle:      'text-white/20',
  waiting:   'text-yellow-400 animate-pulse',
  scanning:  'text-yellow-400 animate-pulse',
  matched:   'text-emerald-400',
  no_match:  'text-red-400',
  error:     'text-red-400',
  no_device: 'text-white/20',
}

const COUNTDOWN_SECS = 5
// Intervalo de reintento cuando el core no está disponible al montar
const RETRY_INTERVAL_MS = 10_000

export default function PunchStation() {
  const [time, setTime]           = useState(new Date())
  const [mode, setMode]           = useState<Mode>('test')

  const [workers, setWorkers]     = useState<WorkerPublic[]>([])
  const [selWorker, setSelWorker] = useState<number | ''>('')

  const [allFps, setAllFps]                     = useState<FingerprintWithWorker[]>([])
  const [identifiedWorker, setIdentifiedWorker] = useState<WorkerPublic | null>(null)

  const [status, setStatus]               = useState<TodayStatus | null>(null)
  const [statusLoading, setStatusLoading] = useState(false)
  const [fpState, setFpState]             = useState<FpState>('idle')
  const [countdown, setCountdown]         = useState<number | null>(null)
  const [pendingAction, setPendingAction] = useState<'in' | 'out' | null>(null)
  const [message, setMessage]             = useState<{ type: 'ok' | 'error' | 'warn' | 'offline'; text: string } | null>(null)
  const [submitting, setSubmitting]       = useState(false)

  // ── Conectividad con el core ──────────────────────────────────────────────
  // true = el core no respondió al montar el componente
  const [coreOffline, setCoreOffline] = useState(false)
  const [dataLoading, setDataLoading] = useState(true)

  // ── Cola offline ──────────────────────────────────────────────────────────
  const [offlineQueue, setOfflineQueue] = useState<PendingTransaction[]>(getQueue())

  useEffect(() => {
    const unsub = onQueueChange(setOfflineQueue)
    return unsub
  }, [])

  const timerRef     = useRef<ReturnType<typeof setTimeout> | null>(null)
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const retryRef     = useRef<ReturnType<typeof setInterval> | null>(null)

  // ── Reloj ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  // ── Carga inicial de workers y huellas ────────────────────────────────────
  // Si el core está caído, el componente sigue funcionando (modo real con
  // huellas en caché o modo test sin lista de nombres). Reintenta cada 10s.
  const loadInitialData = async (): Promise<boolean> => {
    const [wRes, fRes] = await Promise.all([
      workerService.getAll(),
      fingerprintService.getAll(),
    ])

    // api.ts ya no lanza — devuelve { ok: false, error: { name: 'NetworkError' } }
    const isNetErr = (r: { ok: boolean; error?: any }) =>
      !r.ok && r.error?.name === 'NetworkError'

    if (isNetErr(wRes) || isNetErr(fRes)) {
      return false   // core caído
    }

    if (wRes.ok) setWorkers(wRes.data)
    if (fRes.ok) setAllFps(fRes.data)
    return true      // core vivo
  }

  useEffect(() => {
    setDataLoading(true)
    loadInitialData().then(alive => {
      setDataLoading(false)
      setCoreOffline(!alive)

      if (!alive) {
        // Reintenta silenciosamente cada RETRY_INTERVAL_MS
        retryRef.current = setInterval(async () => {
          const ok = await loadInitialData()
          if (ok) {
            setCoreOffline(false)
            clearInterval(retryRef.current!)
            retryRef.current = null
          }
        }, RETRY_INTERVAL_MS)
      }
    })

    return () => {
      if (retryRef.current) clearInterval(retryRef.current)
    }
  }, [])

  // ── Status del worker activo ──────────────────────────────────────────────
  const activeWorkerId = mode === 'test'
    ? (selWorker ? Number(selWorker) : null)
    : (identifiedWorker?.worker_id ?? null)

  useEffect(() => {
    if (!activeWorkerId) { setStatus(null); return }
    loadStatus(activeWorkerId)
  }, [activeWorkerId])

  useEffect(() => {
    setIdentifiedWorker(null)
    setStatus(null)
    setFpState('idle')
    setMessage(null)
    setCountdown(null)
    setPendingAction(null)
    stopCountdown()
  }, [mode])

  async function loadStatus(worker_id: number) {
    setStatusLoading(true)
    const res = await punchService.getTodayStatus(worker_id)
    // api.ts ya no lanza — si hay NetworkError simplemente no actualizamos status
    if (res.ok) setStatus(res.data)
    setStatusLoading(false)
  }

  // ── Flash ─────────────────────────────────────────────────────────────────
  const flash = (type: 'ok' | 'error' | 'warn' | 'offline', text: string) => {
    setMessage({ type, text })
    if (timerRef.current) clearTimeout(timerRef.current)
    if (type !== 'offline') {
      timerRef.current = setTimeout(() => setMessage(null), 7000)
    }
  }

  const resetFpState = (delay = 3000) => {
    setTimeout(() => {
      setFpState('idle')
      setCountdown(null)
      setPendingAction(null)
    }, delay)
  }

  const stopCountdown = () => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current)
      countdownRef.current = null
    }
  }

  // ── Countdown → scan ──────────────────────────────────────────────────────
  function startCountdownAndScan(action: 'in' | 'out') {
    stopCountdown()
    setPendingAction(action)
    setFpState('waiting')
    setIdentifiedWorker(null)
    setStatus(null)
    setMessage(null)
    setCountdown(COUNTDOWN_SECS)

    let remaining = COUNTDOWN_SECS
    countdownRef.current = setInterval(() => {
      remaining -= 1
      setCountdown(remaining)
      if (remaining <= 0) {
        stopCountdown()
        setCountdown(null)
        setFpState('scanning')
        runIdentify(action)
      }
    }, 1000)
  }

  // ── Real mode: 1:N identify ───────────────────────────────────────────────
  async function runIdentify(action: 'in' | 'out') {
    if (allFps.length === 0) {
      flash('warn', 'No fingerprints registered in the system.')
      resetFpState(0)
      return
    }

    const templates = allFps.map(fp => ({
      worker_id: Number(fp.worker_id),
      template: fp.template,
    }))

    const result = await fingerprintService.identify(templates)

    if (!result.ok || !result.worker_id || result.worker_id === 0) {
      if (result.error?.includes('unavailable')) {
        setFpState('no_device')
        flash('warn', 'Device not available. Switch to Test mode.')
      } else {
        setFpState('no_match')
        flash('error', 'Fingerprint not recognized. Please try again.')
      }
      resetFpState(3000)
      return
    }

    const matchedId = Number(result.worker_id)
    setFpState('matched')
    const worker = workers.find(w => Number(w.worker_id) === matchedId) ?? null
    setIdentifiedWorker(worker)

    await new Promise(r => setTimeout(r, 1000))
    await submitPunch(action, matchedId)
  }

  // ── Test mode: verify fingerprint ─────────────────────────────────────────
  async function verifySelectedWorker(): Promise<boolean> {
    if (!selWorker) return false
    setFpState('scanning')

    try {
      const fpRes = await fingerprintService.getByWorker(Number(selWorker))
      if (!fpRes.ok || !fpRes.data) {
        setFpState('no_device')
        flash('warn', 'No fingerprint registered for this worker. Proceeding in test mode.')
        resetFpState()
        return true
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
        flash('error', 'Fingerprint does not match. Try again.')
        resetFpState()
        return false
      }
    } catch {
      setFpState('no_device')
      flash('warn', 'Device offline. Proceeding without fingerprint verification.')
      resetFpState()
      return true
    }
  }

  // ── Submit punch ──────────────────────────────────────────────────────────
  async function submitPunch(action: 'in' | 'out', worker_id: number) {
    const wid = Number(worker_id)
    if (!wid || isNaN(wid)) {
      flash('error', 'Could not identify worker. Please try again.')
      resetFpState(0)
      return
    }

    // Pre-validación de status (solo si el core está vivo)
    const statusRes = await punchService.getTodayStatus(wid)
    if (statusRes.ok) {
      const s = statusRes.data
      if (action === 'in' && s.clocked_in) {
        flash('warn', `You already clocked in today${s.assist ? ` at ${fmtTime(s.assist.start)}` : ''}.`)
        setStatus(s); resetFpState(0); return
      }
      if (action === 'out' && !s.clocked_in) {
        flash('warn', 'You need to clock in before clocking out.')
        setStatus(s); resetFpState(0); return
      }
      if (action === 'out' && s.clocked_out) {
        flash('warn', `You already clocked out today${s.assist?.close ? ` at ${fmtTime(s.assist.close)}` : ''}.`)
        setStatus(s); resetFpState(0); return
      }
    }
    // Si statusRes.ok === false por NetworkError, continuamos igual — el
    // servidor rechazará duplicados y el punch.service encolará si es necesario.

    setSubmitting(true)
    const res = action === 'in'
      ? await punchService.clockIn(wid)
      : await punchService.clockOut(wid)
    setSubmitting(false)

    // Guardado offline
    if (res.ok && res.queued) {
      flash(
        'offline',
        `No connection — ${action === 'in' ? 'clock-in' : 'clock-out'} saved locally at ${fmtTime(res.recorded_at)}. Will sync when server is back.`,
      )
      resetFpState(5000)
      return
    }

    // Error de negocio
    if (!res.ok) {
      const msg = res.error?.message ?? ''
      if (msg.includes('entrada hoy') || msg.includes('clocked in'))
        flash('warn', 'You already clocked in today.')
      else if (msg.includes('salida hoy') || msg.includes('clocked out'))
        flash('warn', 'You already clocked out today.')
      else if (msg.includes('entrada') || msg.includes('clock in'))
        flash('warn', 'You need to clock in before clocking out.')
      else if (msg.includes('encontrado') || msg.includes('not found'))
        flash('error', 'Worker not found in the system.')
      else
        flash('error', msg || 'Error registering. Please try again.')
      loadStatus(wid)
      resetFpState(0)
      return
    }

    // Éxito
    const t = action === 'in' ? res.data.start : res.data.close!
    flash('ok', `${action === 'in' ? 'Clock-in' : 'Clock-out'} registered at ${fmtTime(t)} ✓`)
    loadStatus(wid)
    resetFpState(4000)
  }

  // ── Handlers ──────────────────────────────────────────────────────────────
  async function handleClockIn() {
    if (mode === 'real') { startCountdownAndScan('in'); return }
    if (!selWorker) { flash('error', 'Select a worker first.'); return }
    const ok = await verifySelectedWorker()
    if (!ok) return
    await submitPunch('in', Number(selWorker))
  }

  async function handleClockOut() {
    if (mode === 'real') { startCountdownAndScan('out'); return }
    if (!selWorker) { flash('error', 'Select a worker first.'); return }
    const ok = await verifySelectedWorker()
    if (!ok) return
    await submitPunch('out', Number(selWorker))
  }

  const activeWorker = mode === 'test'
    ? workers.find(w => w.worker_id === Number(selWorker))
    : identifiedWorker

  const isScanning  = fpState === 'waiting' || fpState === 'scanning'
  const canClockIn  = status && !status.clocked_in
  const canClockOut = status && status.clocked_in && !status.clocked_out

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 selection:bg-[#ff5a66]/20">
      <div className="w-full max-w-md space-y-6">

        {/* Reloj */}
        <div className="text-center">
          <p className="text-[56px] font-light text-white/90 leading-none tabular-nums"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            {time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit' })}
          </p>
          <p className="text-[11px] uppercase tracking-[0.3em] text-white/30 mt-2">
            {time.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        {/* ── Banner: core offline al cargar ───────────────────────────────── */}
        {coreOffline && (
          <div className="flex items-start gap-3 px-4 py-3 bg-orange-500/8 border border-orange-500/25 rounded-sm">
            <WifiOff className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-[11px] font-semibold text-orange-400 uppercase tracking-[0.15em]">
                Server unreachable
              </p>
              <p className="text-[11px] text-orange-400/60 mt-0.5">
                Worker list unavailable. Fingerprint mode still works. Punches will be saved offline.
              </p>
              <p className="text-[10px] text-orange-400/40 mt-1 flex items-center gap-1">
                <RefreshCw className="w-3 h-3 animate-spin" />
                Retrying every {RETRY_INTERVAL_MS / 1000}s...
              </p>
            </div>
          </div>
        )}

        {/* ── Banner: cola de sincronización pendiente ─────────────────────── */}
        {offlineQueue.length > 0 && (
          <div className="flex items-start gap-3 px-4 py-3 bg-yellow-500/8 border border-yellow-500/25 rounded-sm">
            <Clock className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-semibold text-yellow-400 uppercase tracking-[0.15em] mb-1.5">
                {offlineQueue.length} pending sync{offlineQueue.length > 1 ? 's' : ''}
              </p>
              <ul className="space-y-1">
                {offlineQueue.map(tx => {
                  const w = workers.find(w => Number(w.worker_id) === tx.worker_id)
                  const name = w ? `${w.first_name} ${w.last_name}` : `Worker #${tx.worker_id}`
                  return (
                    <li key={tx.id} className="flex items-center gap-2 text-[11px] text-yellow-400/70">
                      <span className="w-1.5 h-1.5 rounded-full bg-yellow-400/40 shrink-0" />
                      <span>
                        {tx.action === 'in' ? 'Clock-in' : 'Clock-out'} · {name} · {fmtTime(tx.recorded_at)}
                        {tx.retries > 0 && <span className="ml-1 text-yellow-400/40">(retry {tx.retries})</span>}
                      </span>
                    </li>
                  )
                })}
              </ul>
              <p className="text-[10px] text-yellow-400/40 mt-1.5 uppercase tracking-[0.1em]">
                Will sync automatically when server is back
              </p>
            </div>
          </div>
        )}

        {/* Mode toggle */}
        <div className="flex items-center justify-center">
          <div className="flex items-center bg-[#1a1a1a] border border-white/10 rounded-sm p-1 gap-1">
            <button onClick={() => setMode('test')} disabled={isScanning}
              className={`flex items-center gap-2 px-4 py-2 rounded-sm text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${
                mode === 'test' ? 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30' : 'text-white/30 hover:text-white/60'
              }`}>
              <FlaskConical className="w-3.5 h-3.5" /> Test
            </button>
            <button onClick={() => setMode('real')} disabled={isScanning}
              className={`flex items-center gap-2 px-4 py-2 rounded-sm text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${
                mode === 'real' ? 'bg-[#ff5a66]/15 text-[#ff5a66] border border-[#ff5a66]/30' : 'text-white/30 hover:text-white/60'
              }`}>
              <Cpu className="w-3.5 h-3.5" /> Real
            </button>
          </div>
        </div>

        {/* Card */}
        <div className="bg-[#1a1a1a] border border-white/10 rounded-sm p-8 space-y-6">

          {/* Test: worker selector */}
          {mode === 'test' && (
            <div>
              <label className="block text-[9px] font-semibold uppercase tracking-[0.3em] text-white/30 mb-2">
                Select Worker
              </label>
              {dataLoading ? (
                <div className="w-full h-10 bg-white/5 rounded-sm animate-pulse" />
              ) : (
                <select
                  value={selWorker}
                  onChange={e => setSelWorker(e.target.value ? Number(e.target.value) : '')}
                  className="w-full bg-[#0a0a0a] border border-white/10 text-white/80 text-[13px] px-3 py-2.5 rounded-sm outline-none focus:border-[#ff5a66] cursor-pointer [&>option]:bg-[#1a1a1a]"
                >
                  {coreOffline
                    ? <option value="">Server offline — fingerprint mode only</option>
                    : <>
                        <option value="">Select your name...</option>
                        {workers.map(w => (
                          <option key={w.worker_id} value={w.worker_id}>
                            {w.first_name} {w.last_name}
                          </option>
                        ))}
                      </>
                  }
                </select>
              )}
            </div>
          )}

          {/* Real: identified worker */}
          {mode === 'real' && identifiedWorker && (
            <div className="flex items-center gap-3 px-4 py-3 bg-emerald-500/8 border border-emerald-500/20 rounded-sm">
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <p className="text-[13px] text-white/90 font-medium">
                  {identifiedWorker.first_name} {identifiedWorker.last_name}
                </p>
                <p className="text-[10px] text-white/30 uppercase tracking-[0.15em]">{identifiedWorker.specialty}</p>
              </div>
            </div>
          )}

          {/* Today's status */}
          {activeWorkerId && !statusLoading && status && (
            <div className="bg-black/40 border border-white/8 rounded-sm px-4 py-3 space-y-2">
              <p className="text-[9px] uppercase tracking-[0.3em] text-white/25 mb-2">Today's Status</p>
              <div className="flex items-center gap-2">
                {status.clocked_in
                  ? <CheckCircle className="w-4 h-4 text-emerald-400" />
                  : <XCircle className="w-4 h-4 text-white/20" />}
                <span className="text-[12px] text-white/70">
                  Clock-in: {status.assist ? fmtTime(status.assist.start) : '—'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {status.clocked_out
                  ? <CheckCircle className="w-4 h-4 text-[#ff5a66]" />
                  : <XCircle className="w-4 h-4 text-white/20" />}
                <span className="text-[12px] text-white/70">
                  Clock-out: {status.assist?.close ? fmtTime(status.assist.close) : '—'}
                </span>
              </div>
            </div>
          )}

          {/* Fingerprint + countdown */}
          <div className="flex flex-col items-center gap-3 py-2">
            <div className="relative">
              <Fingerprint className={`w-16 h-16 transition-colors ${FP_COLORS[fpState]}`} />
              {countdown !== null && (
                <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-yellow-500 flex items-center justify-center">
                  <span className="text-black text-[12px] font-bold">{countdown}</span>
                </div>
              )}
            </div>
            <div className="text-center space-y-1">
              <p className="text-[12px] text-white/50">{FP_LABELS[fpState]}</p>
              {fpState === 'waiting' && pendingAction && (
                <p className="text-[10px] text-yellow-400/60 uppercase tracking-[0.2em]">
                  Preparing {pendingAction === 'in' ? 'clock-in' : 'clock-out'}...
                </p>
              )}
            </div>
          </div>

          {/* Message */}
          {message && (
            <div className={`flex items-start gap-2.5 px-4 py-3 rounded-sm border text-[12px] ${
              message.type === 'ok'      ? 'bg-emerald-500/8 border-emerald-500/20 text-emerald-400' :
              message.type === 'warn'    ? 'bg-yellow-500/8 border-yellow-500/20 text-yellow-400' :
              message.type === 'offline' ? 'bg-yellow-500/8 border-yellow-500/25 text-yellow-300' :
                                           'bg-red-500/8 border-red-500/20 text-red-400'
            }`}>
              {message.type === 'offline'
                ? <WifiOff className="w-4 h-4 shrink-0 mt-0.5" />
                : <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />}
              <p>{message.text}</p>
            </div>
          )}

          {/* Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleClockIn}
              disabled={
                isScanning || submitting ||
                (mode === 'test' && (!selWorker || (!coreOffline && !canClockIn))) ||
                (mode === 'real' && !!identifiedWorker && !canClockIn)
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
                (mode === 'test' && (!selWorker || (!coreOffline && !canClockOut))) ||
                (mode === 'real' && !!identifiedWorker && !canClockOut)
              }
              className="h-14 flex flex-col items-center justify-center gap-1 bg-[#ff5a66] hover:bg-[#ff7078] text-black rounded-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Clock Out</span>
            </button>
          </div>

          {activeWorker && !isScanning && (
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
