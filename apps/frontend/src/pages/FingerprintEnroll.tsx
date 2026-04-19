import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Fingerprint, Trash2, RefreshCw, CheckCircle, AlertCircle, Lock } from 'lucide-react'
import { fingerprintService } from '@/lib/punch.service'
import { workerService } from '@/lib/people.service'
import { authService } from '@/lib/auth.service'
import type { WorkerPublic } from '@final/shared'

const schema = yup.object({
  email:    yup.string().email().required(),
  password: yup.string().required(),
}).required()
type LoginForm = yup.InferType<typeof schema>

type FpState = 'idle' | 'scanning' | 'captured' | 'error' | 'no_device'

const inputCls = "w-full bg-[#0a0a0a] border border-white/10 text-white/80 text-[13px] px-3 py-2.5 rounded-sm outline-none focus:border-[#ff5a66] transition-colors placeholder:text-white/20"
const labelCls = "block text-[9px] font-semibold uppercase tracking-[0.3em] text-white/30 mb-2"

export default function FingerprintEnroll() {
  const [authed,    setAuthed]    = useState(false)
  const [worker,    setWorker]    = useState<WorkerPublic | null>(null)
  const [existing,  setExisting]  = useState<{ fingerprint_id: number; finger_index: number; updated_at: string } | null>(null)
  const [fpState,   setFpState]   = useState<FpState>('idle')
  const [captured,  setCaptured]  = useState<string | null>(null)
  const [message,   setMessage]   = useState<{ type: 'ok' | 'error'; text: string } | null>(null)
  const [saving,    setSaving]    = useState(false)
  const [deleting,  setDeleting]  = useState(false)
  const [loginErr,  setLoginErr]  = useState<string | null>(null)
  // Enrollment multi-step state
  const REQUIRED_STEPS = 4
  const [enrollSteps, setEnrollSteps] = useState<string[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [stepLoading, setStepLoading] = useState(false)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: yupResolver(schema)
  })

  const flash = (type: 'ok' | 'error', text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 4000)
  }

  const onLogin = async (data: LoginForm) => {
    setLoginErr(null)
    const res = await authService.login(data)
    if (!res.ok) { setLoginErr(res.error.message); return }
    if (res.data.type !== 'worker' && res.data.type !== 'cashier') {
      setLoginErr('Only workers and cashiers can enroll fingerprints.')
      return
    }
    // Get worker record
    const workersRes = await workerService.getAll()
    if (!workersRes.ok) { setLoginErr('Could not load worker data.'); return }
    const w = workersRes.data.find(w => w.person_id === res.data.person_id)
    if (!w) { setLoginErr('Worker record not found.'); return }
    setWorker(w)
    setAuthed(true)
    // Load existing fingerprint
    const fpRes = await fingerprintService.getByWorker(w.worker_id)
    if (fpRes.ok && fpRes.data) setExisting(fpRes.data as any)
  }

  async function handleScan() {
    if (stepLoading) return
    setStepLoading(true)
    setCaptured(null)
    try {
      // Capture one enrollment step
      const res = await fetch('http://localhost:5100/enroll/step', { method: 'POST' })
      if (!res.ok) throw new Error('Device error')
      const data = await res.json()
      if (!data.ok) throw new Error(data.error ?? 'Scan failed')

      const newSteps = [...enrollSteps, data.fmd_b64]
      setEnrollSteps(newSteps)
      setCurrentStep(newSteps.length)

      if (newSteps.length >= REQUIRED_STEPS) {
        setFpState('captured')
        // Build the final template from all 4 feature sets
        const finishRes = await fetch('http://localhost:5100/enroll/finish', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fmds: newSteps }),
        })
        const finishData = await finishRes.json()
        if (!finishData.ok) {
          setEnrollSteps([]); setCurrentStep(0); setFpState('error')
          flash('error', finishData.error ?? 'Enrollment failed. Please start over.')
        } else {
          setCaptured(finishData.template_b64)
          flash('ok', 'All 4 scans captured successfully. Save your fingerprint.')
        }
      } else {
        setFpState('idle')
        flash('ok', `Scan ${newSteps.length} of ${REQUIRED_STEPS} — place finger again.`)
      }
    } catch {
      setFpState('no_device')
      flash('error', 'Fingerprint device not available. Make sure the .NET service is running on port 5100.')
    } finally {
      setStepLoading(false)
    }
  }

  function resetEnrollment() {
    setEnrollSteps([]); setCurrentStep(0); setCaptured(null); setFpState('idle')
  }

  async function handleSave() {
    if (!captured || !worker) return
    setSaving(true)
    const res = await fingerprintService.upsert(worker.worker_id, captured, 0)
    setSaving(false)
    if (!res.ok) { flash('error', res.error.message); return }
    setExisting(res.data as any)
    setCaptured(null)
    setFpState('idle')
    resetEnrollment()
    flash('ok', 'Fingerprint registered successfully.')
  }

  async function handleDelete() {
    if (!worker) return
    setDeleting(true)
    const res = await fingerprintService.delete(worker.worker_id)
    setDeleting(false)
    if (!res.ok) { flash('error', res.error.message); return }
    setExisting(null)
    flash('ok', 'Fingerprint removed.')
  }

  const fpColors: Record<FpState, string> = {
    idle:      'text-white/20',
    scanning:  'text-yellow-400 animate-pulse',
    captured:  'text-emerald-400',
    error:     'text-red-400',
    no_device: 'text-red-400',
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 selection:bg-[#ff5a66]/20">
        <div className="w-full max-w-sm">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-sm p-8 space-y-6">
            <div className="text-center">
              <div className="w-14 h-14 bg-[#ff5a66]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-7 h-7 text-[#ff5a66]" />
              </div>
              <h1 className="text-[28px] font-light text-white/95" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                Fingerprint Enrollment
              </h1>
              <p className="text-[11px] text-white/30 mt-1">Sign in with your staff credentials</p>
            </div>

            <form onSubmit={handleSubmit(onLogin)} className="space-y-5">
              <div>
                <label className={labelCls}>Email</label>
                <input {...register('email')} type="email" className={inputCls} placeholder="you@obsidian.com" />
                {errors.email && <p className="mt-1 text-[9px] text-[#ff5a66]/80 uppercase tracking-wider">{errors.email.message}</p>}
              </div>
              <div>
                <label className={labelCls}>Password</label>
                <input {...register('password')} type="password" className={inputCls} placeholder="••••••••" />
                {errors.password && <p className="mt-1 text-[9px] text-[#ff5a66]/80 uppercase tracking-wider">{errors.password.message}</p>}
              </div>
              {loginErr && (
                <div className="flex items-start gap-2 px-3 py-2.5 bg-red-500/8 border border-red-500/20 rounded-sm">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-red-400">{loginErr}</p>
                </div>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 bg-[#ff5a66] hover:bg-[#ff7078] text-black text-[10px] font-bold uppercase tracking-[0.3em] rounded-sm disabled:opacity-50 transition-all"
              >
                {isSubmitting ? 'Verifying...' : 'Sign In'}
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 selection:bg-[#ff5a66]/20">
      <div className="w-full max-w-md space-y-6">

        <div className="text-center">
          <h1 className="text-[40px] font-light text-white/95" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Fingerprint Enrollment
          </h1>
          <p className="text-[11px] text-white/30 mt-1 uppercase tracking-[0.25em]">
            {worker?.first_name} {worker?.last_name}
          </p>
        </div>

        <div className="bg-[#1a1a1a] border border-white/10 rounded-sm p-8 space-y-6">

          {/* Current status */}
          <div className={`flex items-center gap-3 px-4 py-3 rounded-sm border ${
            existing
              ? 'bg-emerald-500/8 border-emerald-500/20'
              : 'bg-yellow-500/8 border-yellow-500/20'
          }`}>
            {existing
              ? <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
              : <AlertCircle className="w-5 h-5 text-yellow-400 shrink-0" />}
            <div>
              <p className={`text-[12px] font-medium ${existing ? 'text-emerald-400' : 'text-yellow-400'}`}>
                {existing ? 'Fingerprint registered' : 'No fingerprint registered'}
              </p>
              {existing && (
                <p className="text-[10px] text-white/30 mt-0.5">
                  Last updated: {new Date(existing.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              )}
            </div>
          </div>

          {/* Scanner */}
          <div className="flex flex-col items-center gap-4 py-4">
            <Fingerprint className={`w-20 h-20 transition-colors ${fpColors[fpState]}`} />

            {/* Step progress dots */}
            <div className="flex items-center gap-2">
              {Array.from({ length: REQUIRED_STEPS }).map((_, i) => (
                <div key={i} className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  i < currentStep ? 'bg-[#ff5a66]' : 'bg-white/10'
                }`} />
              ))}
            </div>

            <p className="text-[11px] text-white/30 text-center">
              {stepLoading
                ? 'Place finger on reader...'
                : currentStep === 0
                  ? 'Ready — place finger to start enrollment'
                  : currentStep < REQUIRED_STEPS
                    ? `${currentStep} of ${REQUIRED_STEPS} scans done — place finger again`
                    : fpState === 'captured'
                      ? 'All scans captured ✓'
                      : 'Processing...'}
            </p>
          </div>

          {/* Message */}
          {message && (
            <div className={`flex items-start gap-2.5 px-4 py-3 rounded-sm border text-[12px] ${
              message.type === 'ok'
                ? 'bg-emerald-500/8 border-emerald-500/20 text-emerald-400'
                : 'bg-red-500/8 border-red-500/20 text-red-400'
            }`}>
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <p>{message.text}</p>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={handleScan}
              disabled={stepLoading || fpState === 'captured'}
              className="w-full h-12 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#ff5a66]/40 text-white/60 hover:text-white text-[10px] font-bold uppercase tracking-[0.3em] rounded-sm disabled:opacity-40 transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${stepLoading ? 'animate-spin' : ''}`} />
              {stepLoading
                ? 'Scanning...'
                : currentStep === 0
                  ? existing ? 'Re-enroll Fingerprint' : 'Start Enrollment'
                  : `Scan ${currentStep + 1} of ${REQUIRED_STEPS}`}
            </button>

            {currentStep > 0 && fpState !== 'captured' && (
              <button
                type="button"
                onClick={resetEnrollment}
                className="w-full h-9 border border-white/10 text-white/30 hover:text-white/60 text-[10px] uppercase tracking-[0.2em] rounded-sm transition-all"
              >
                Start over
              </button>
            )}

            {captured && fpState === 'captured' && (
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full h-12 bg-[#ff5a66] hover:bg-[#ff7078] text-black text-[10px] font-bold uppercase tracking-[0.3em] rounded-sm disabled:opacity-50 transition-all"
              >
                {saving ? 'Saving...' : existing ? 'Update Fingerprint' : 'Save Fingerprint'}
              </button>
            )}

            {existing && (
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="w-full h-10 border border-red-500/20 text-red-400/60 hover:text-red-400 hover:border-red-500/40 text-[10px] font-bold uppercase tracking-[0.25em] rounded-sm disabled:opacity-40 transition-all flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                {deleting ? 'Removing...' : 'Remove Fingerprint'}
              </button>
            )}
          </div>
        </div>

        <p className="text-center text-[9px] uppercase tracking-[0.3em] text-white/10">
          Obsidian Archive · Internal Terminal
        </p>
      </div>
    </div>
  )
}
