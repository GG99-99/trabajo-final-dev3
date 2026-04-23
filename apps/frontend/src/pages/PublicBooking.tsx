import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Link } from 'react-router-dom'
import Scrollable from '@/componentes/Scrollable'
import { publicService, type PublicWorker } from '@/lib/public.service'
import type { Tattoo } from '@/lib/tattoo.service'
import type { AppointmentBlockTime } from '@final/shared'
import {
  Calendar, Clock, ChevronDown, CheckCircle,
  AlertCircle, ArrowLeft, Sparkles, User2, Mail
} from 'lucide-react'
import heroImg from '@/assets/hero.png'

// ── helpers ────────────────────────────────────────────────────────────────
const pad = (n: number) => String(n).padStart(2, '0')
const toDateStr = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
const today = toDateStr(new Date())

const timeToMinutes = (t: string) => {
  const [h, m] = t.split(':').map(Number)
  return (h ?? 0) * 60 + (m ?? 0)
}
const addMinutes = (time: string, mins: number) => {
  const total = timeToMinutes(time) + mins
  return `${pad(Math.floor(total / 60))}:${pad(total % 60)}`
}
const to12h = (t: string) => {
  const [h, m] = t.split(':').map(Number)
  const period = (h ?? 0) >= 12 ? 'PM' : 'AM'
  const hour   = (h ?? 0) % 12 || 12
  return `${hour}:${pad(m ?? 0)} ${period}`
}

function generateSlots(block: AppointmentBlockTime, durationMins: number) {
  const slots: { start: string; end: string }[] = []
  let cursor = block.start
  while (true) {
    const end = addMinutes(cursor, durationMins)
    if (end > block.end) break
    slots.push({ start: cursor, end })
    cursor = end
  }
  return slots
}

function filterPastSlots(slots: { start: string; end: string }[], date: string) {
  if (date !== today) return slots
  const now = new Date()
  const currentMins = now.getHours() * 60 + now.getMinutes()
  return slots.filter(s => timeToMinutes(s.start) > currentMins)
}

// ── schema ─────────────────────────────────────────────────────────────────
const schema = yup.object({
  email: yup.string().email('Invalid email').required('Required'),
}).required()

type FormData = yup.InferType<typeof schema>

// ── sub-components ─────────────────────────────────────────────────────────
function StepBadge({ n, active }: { n: number; active: boolean }) {
  return (
    <span className={`w-7 h-7 rounded-full text-[11px] font-bold flex items-center justify-center shrink-0 transition-colors ${
      active ? 'bg-[#ff5a66] text-black' : 'bg-white/10 text-white/40'
    }`}>
      {n}
    </span>
  )
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null
  return <p className="mt-1.5 text-[10px] uppercase tracking-wider text-[#ff5a66]/90">{msg}</p>
}

// ── component ──────────────────────────────────────────────────────────────
export default function PublicBooking() {
  // ── booking data ──
  const [tattoos, setTattoos] = useState<Tattoo[]>([])
  const [workers, setWorkers] = useState<PublicWorker[]>([])
  const [blocks,  setBlocks]  = useState<AppointmentBlockTime[]>([])
  const [slots,   setSlots]   = useState<{ start: string; end: string }[]>([])

  const [selTattoo,  setSelTattoo]  = useState<number | ''>('')
  const [selWorker,  setSelWorker]  = useState<number | ''>('')
  const [selDate,    setSelDate]    = useState(today)
  const [selSlotIdx, setSelSlotIdx] = useState<number | ''>('')

  // ── email-first flow state ──
  // step: 0=email+OTP, 1=personal info (new users only), 2=session, 3=slot, 4=confirm
  const [flowStep,           setFlowStep]           = useState(0)
  const [emailChecked,       setEmailChecked]       = useState(false)
  const [isExistingClient,   setIsExistingClient]   = useState(false)
  const [existingClientData, setExistingClientData] = useState<{ first_name: string; last_name: string; client_id?: number } | null>(null)
  const [emailCheckLoading,  setEmailCheckLoading]  = useState(false)
  const [emailInput,         setEmailInput]         = useState('')
  const [emailError,         setEmailError]         = useState<string | null>(null)

  // ── OTP state ──
  const [otpSent,        setOtpSent]        = useState(false)
  const [otpLoading,     setOtpLoading]     = useState(false)
  const [otpInput,       setOtpInput]       = useState('')
  const [otpError,       setOtpError]       = useState<string | null>(null)
  const [otpVerified,    setOtpVerified]    = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)

  // ── personal info state (new users) ──
  const [firstName,    setFirstName]    = useState('')
  const [lastName,     setLastName]     = useState('')
  const [medicalNotes, setMedicalNotes] = useState('')
  const [nameErrors,   setNameErrors]   = useState<{ first_name?: string; last_name?: string }>({})

  // ── misc ──
  const [blocksLoading, setBlocksLoading] = useState(false)
  const [blocksReady,   setBlocksReady]   = useState(false)
  const [submitting,    setSubmitting]    = useState(false)
  const [apiError,      setApiError]      = useState<string | null>(null)
  const [success,       setSuccess]       = useState(false)
  const [apptNumber,    setApptNumber]    = useState<string | null>(null)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema),
  })

  useEffect(() => {
    Promise.all([publicService.getTattoos(), publicService.getWorkers()]).then(([t, w]) => {
      if (t.ok) setTattoos(t.data)
      if (w.ok) setWorkers(w.data)
    })
  }, [])

  // ── Resend cooldown timer ─────────────────────────────────────────────────
  useEffect(() => {
    if (resendCooldown <= 0) return
    const t = setTimeout(() => setResendCooldown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [resendCooldown])

  const selectedTattoo = tattoos.find(t => t.tattoo_id === Number(selTattoo))
  const selectedWorker = workers.find(w => w.worker_id === Number(selWorker))
  const selectedSlot   = slots[Number(selSlotIdx)]
  const sessionReady   = selTattoo && selWorker && selDate

  const resetSlots = () => {
    setBlocksReady(false)
    setSlots([])
    setSelSlotIdx('')
    setBlocks([])
  }

  // ── Step 0a: send OTP ────────────────────────────────────────────────────
  async function handleSendCode() {
    setEmailError(null)
    const trimmed = emailInput.trim()
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setEmailError('Please enter a valid email address.')
      return
    }
    setOtpLoading(true)
    try {
      const res = await publicService.sendCode(trimmed)
      if (!res.ok) { setEmailError('Failed to send code. Please try again.'); return }
      setOtpSent(true)
      setResendCooldown(60)
      setOtpInput('')
      setOtpError(null)
    } catch {
      setEmailError('Failed to send code. Please try again.')
    } finally {
      setOtpLoading(false)
    }
  }

  // ── Step 0b: verify OTP then check email ─────────────────────────────────
  async function handleVerifyAndContinue() {
    setOtpError(null)
    if (!otpInput.trim() || otpInput.trim().length !== 6) {
      setOtpError('Please enter the 6-digit code sent to your email.')
      return
    }
    setEmailCheckLoading(true)
    try {
      const verRes = await publicService.verifyCode(emailInput.trim(), otpInput.trim())
      if (!verRes.ok) {
        setOtpError((verRes as any).error?.message ?? 'Invalid or expired code.')
        return
      }
      setOtpVerified(true)
      await handleEmailContinue()
    } catch {
      setOtpError('Verification failed. Please try again.')
    } finally {
      setEmailCheckLoading(false)
    }
  }

  // ── Step 0c: check email (called after OTP verified) ─────────────────────
  async function handleEmailContinue() {
    setEmailError(null)
    const trimmed = emailInput.trim()
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setEmailError('Please enter a valid email address.')
      return
    }
    setEmailCheckLoading(true)
    try {
      const res = await publicService.checkEmail(trimmed)
      if (!res.ok) {
        setEmailError('Could not verify email. Please try again.')
        return
      }

      // Staff email — hard block, do not allow to continue
      if (res.data.blocked) {
        setEmailError(
          'This email is registered as a studio staff member. Please use a personal email to book an appointment.'
        )
        return
      }

      if (res.data.exists) {
        setIsExistingClient(true)
        setExistingClientData({
          first_name: res.data.first_name ?? '',
          last_name:  res.data.last_name  ?? '',
          client_id:  res.data.client_id,
        })
        setEmailChecked(true)
        setFlowStep(2) // skip personal info for existing clients
      } else {
        setIsExistingClient(false)
        setExistingClientData(null)
        setEmailChecked(true)
        setFlowStep(1) // go to personal info for new clients
      }
    } catch {
      setEmailError('Could not verify email. Please try again.')
    } finally {
      setEmailCheckLoading(false)
    }
  }

  // ── Step 1: validate personal info ──────────────────────────────────────
  function handlePersonalInfoContinue() {
    const errs: { first_name?: string; last_name?: string } = {}
    if (!firstName.trim()) errs.first_name = 'Required'
    if (!lastName.trim())  errs.last_name  = 'Required'
    if (Object.keys(errs).length > 0) { setNameErrors(errs); return }
    setNameErrors({})
    setFlowStep(2)
  }

  // ── Fetch slots (step 2 → 3) ─────────────────────────────────────────────
  async function fetchSlots() {
    if (!selTattoo || !selWorker || !selDate) return
    const tattoo = tattoos.find(t => t.tattoo_id === Number(selTattoo))
    if (!tattoo) return
    setBlocksLoading(true)
    resetSlots()
    const res = await publicService.getBlocks(Number(selWorker), selDate)
    if (!res.ok) { setBlocksLoading(false); setBlocksReady(true); return }
    const durationMins = timeToMinutes(tattoo.time)
    const allSlots = res.data.flatMap(b => generateSlots(b, durationMins))
    setBlocks(res.data)
    setSlots(filterPastSlots(allSlots, selDate))
    setBlocksLoading(false)
    setBlocksReady(true)
    setFlowStep(3)
  }

  // ── Submit ───────────────────────────────────────────────────────────────
  const onSubmit = async (_data: FormData) => {
    if (!selTattoo || !selWorker || selSlotIdx === '') {
      setApiError('Please complete all booking fields.')
      return
    }
    const slot = slots[Number(selSlotIdx)]
    if (!slot) { setApiError('Invalid slot.'); return }

    const first = isExistingClient ? (existingClientData?.first_name ?? '') : firstName
    const last  = isExistingClient ? (existingClientData?.last_name  ?? '') : lastName

    setSubmitting(true)
    setApiError(null)
    const res = await publicService.book({
      email:         emailInput.trim(),
      first_name:    first,
      last_name:     last,
      medical_notes: medicalNotes || undefined,
      worker_id:     Number(selWorker),
      tattoo_id:     Number(selTattoo),
      date:          selDate,
      start:         slot.start,
      end:           slot.end,
    })
    setSubmitting(false)
    if (!res.ok) { setApiError(res.error.message); return }
    setApptNumber((res.data as any)?.apptNumber ?? null)
    setSuccess(true)
    reset()
    setEmailInput(''); setFirstName(''); setLastName(''); setMedicalNotes('')
    setEmailChecked(false); setIsExistingClient(false); setExistingClientData(null)
    setOtpSent(false); setOtpVerified(false); setOtpInput(''); setOtpError(null); setResendCooldown(0)
    setFlowStep(0)
    setSelTattoo(''); setSelWorker(''); setSelDate(today)
    setSelSlotIdx(''); resetSlots()
  }

  const inputCls  = "w-full border-b border-white/15 bg-transparent pb-2.5 text-[14px] font-light text-white/90 outline-none transition-all focus:border-[#ff5a66] placeholder:text-white/20"
  const labelCls  = "block text-[9px] font-semibold uppercase tracking-[0.3em] text-white/40 mb-2"
  const selectCls = "w-full bg-[#111] border border-white/10 text-white/80 text-[13px] px-3 py-2.5 rounded-sm outline-none focus:border-[#ff5a66] cursor-pointer appearance-none [&>option]:bg-[#111] transition-colors"

  // ── success screen ────────────────────────────────────────────────────────
  if (success) {
    return (
      <Scrollable style={{ height: '100svh' }}>
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 selection:bg-[#ff5a66]/20">
          <div className="max-w-md w-full text-center space-y-8">
            <div className="w-20 h-20 bg-[#ff5a66]/10 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10 text-[#ff5a66]" />
            </div>
            <div>
              <h1
                className="text-[48px] font-light text-white/95 leading-none"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                You're booked.
              </h1>
              <p className="mt-3 text-[13px] text-white/40 leading-relaxed">
                Your session has been confirmed.<br />
                We'll see you soon at Obsidian Archive.
              </p>
              {apptNumber && (
                <div className="mt-5 inline-block bg-[#1a1a1a] border border-white/10 rounded-sm px-5 py-3">
                  <p className="text-[9px] uppercase tracking-[0.3em] text-white/30 mb-1">Order number</p>
                  <p className="text-[20px] font-semibold tracking-[0.15em] text-[#ff5a66]">{apptNumber}</p>
                  <p className="text-[10px] text-white/25 mt-1">Check your email for confirmation</p>
                </div>
              )}
            </div>
            <div className="h-px bg-white/10" />
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => { setSuccess(false); setApptNumber(null) }}
                className="h-11 px-6 bg-[#ff5a66] hover:bg-[#ff7078] text-black text-[10px] font-bold uppercase tracking-[0.3em] rounded-sm transition-colors"
              >
                Book another
              </button>
              <Link
                to="/"
                className="h-11 px-6 flex items-center border border-white/10 text-white/40 hover:text-white hover:border-white/20 text-[10px] uppercase tracking-[0.2em] rounded-sm transition-colors"
              >
                Back to home
              </Link>
            </div>
          </div>
        </div>
      </Scrollable>
    )
  }

  // ── main form ─────────────────────────────────────────────────────────────
  return (
    <Scrollable style={{ height: '100svh' }}>
      <div className="min-h-screen bg-[#0a0a0a] selection:bg-[#ff5a66]/20">

        {/* ── HERO ── */}
        <div className="relative h-[45vh] min-h-[300px] overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center scale-105"
            style={{ backgroundImage: `url(${heroImg})`, filter: 'grayscale(50%) brightness(0.45)' }}
          />
          <div className="absolute inset-0 bg-linear-to-b from-transparent via-black/20 to-[#0a0a0a]" />

          <Link
            to="/"
            className="absolute top-6 left-6 flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-white/40 hover:text-white transition-colors z-10"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </Link>

          <div className="absolute bottom-10 left-8 md:left-16 z-10">
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#ff5a66]/70 mb-3">
              Obsidian Archive
            </p>
            <h1
              className="text-[52px] md:text-[72px] font-light uppercase italic leading-[0.88] text-white/95"
              style={{ fontFamily: 'Cormorant Garamond, Georgia, serif' }}
            >
              Reserve your<br />
              <span className="text-[#ff5a66] drop-shadow-[0_0_30px_rgba(255,90,102,0.4)]">
                session
              </span>
            </h1>
          </div>
        </div>

        {/* ── FORM ── */}
        <div className="max-w-xl mx-auto px-6 py-12">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-0">

            {/* ── STEP 0: Email ── */}
            <div className="bg-[#1a1a1a] border border-white/10 rounded-t-sm p-8 space-y-6">
              <div className="flex items-center gap-3">
                <StepBadge n={1} active={true} />
                <div>
                  <p className="text-[13px] text-white/80 font-medium">Your email</p>
                  <p className="text-[11px] text-white/30">We'll look up your profile</p>
                </div>
              </div>

              <div>
                <label className={labelCls}>Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 pointer-events-none" />
                  <input
                    type="email"
                    value={emailInput}
                    onChange={e => { setEmailInput(e.target.value); setEmailError(null) }}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleEmailContinue() } }}
                    disabled={emailChecked}
                    className={`${inputCls} pl-8 ${emailChecked ? 'opacity-50 cursor-not-allowed' : ''}`}
                    placeholder="you@example.com"
                  />
                </div>
                {emailError && (
                  <div className={`mt-3 flex items-start gap-2.5 px-4 py-3 rounded-sm border ${
                    emailError.includes('staff member')
                      ? 'bg-red-500/8 border-red-500/25 text-red-400'
                      : 'bg-[#ff5a66]/5 border-[#ff5a66]/20 text-[#ff5a66]/90'
                  }`}>
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <p className="text-[11px] leading-relaxed">{emailError}</p>
                  </div>
                )}
                {emailChecked && isExistingClient && existingClientData && (
                  <p className="mt-2 text-[11px] text-emerald-400/80">
                    Welcome back, {existingClientData.first_name}!
                  </p>
                )}
                {emailChecked && !isExistingClient && (
                  <p className="mt-2 text-[11px] text-white/30">
                    New here — please fill in your details below.
                  </p>
                )}
              </div>

              {/* ── OTP block (shown after Send Code is clicked) ── */}
              {!emailChecked && otpSent && (
                <div className="space-y-4">
                  <div>
                    <label className={labelCls}>Verification Code</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={otpInput}
                      onChange={e => { setOtpInput(e.target.value.replace(/\D/g, '')); setOtpError(null) }}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleVerifyAndContinue() } }}
                      className={inputCls}
                      placeholder="Enter 6-digit code"
                    />
                    {otpError && (
                      <div className="mt-3 flex items-start gap-2.5 px-4 py-3 rounded-sm border bg-[#ff5a66]/5 border-[#ff5a66]/20">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#ff5a66]/90" />
                        <p className="text-[11px] text-[#ff5a66]/90 leading-relaxed">{otpError}</p>
                      </div>
                    )}
                    <p className="mt-2 text-[10px] text-white/25">
                      Code sent to <span className="text-white/50">{emailInput}</span>.
                      {resendCooldown > 0
                        ? <> Resend in {resendCooldown}s.</>
                        : <> <button type="button" onClick={handleSendCode} className="underline text-white/40 hover:text-white/70 transition-colors">Resend code</button>.</>}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleVerifyAndContinue}
                    disabled={emailCheckLoading || otpInput.length !== 6}
                    className="w-full h-11 bg-[#ff5a66] hover:bg-[#ff7078] text-black text-[10px] font-bold uppercase tracking-[0.3em] rounded-sm disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                  >
                    {emailCheckLoading ? (
                      <><span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-black/30 border-t-black" /> Verifying…</>
                    ) : 'Verify & Continue →'}
                  </button>

                  <button
                    type="button"
                    onClick={() => { setOtpSent(false); setOtpInput(''); setOtpError(null); setEmailError(null) }}
                    className="w-full text-[10px] uppercase tracking-[0.2em] text-white/25 hover:text-white/50 transition-colors"
                  >
                    ← Change email
                  </button>
                </div>
              )}

              {/* ── Initial: just the Send Code button ── */}
              {!emailChecked && !otpSent ? (
                <button
                  type="button"
                  onClick={handleSendCode}
                  disabled={otpLoading}
                  className="w-full h-11 bg-[#ff5a66] hover:bg-[#ff7078] text-black text-[10px] font-bold uppercase tracking-[0.3em] rounded-sm disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {otpLoading ? (
                    <><span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-black/30 border-t-black" /> Sending code…</>
                  ) : 'Send verification code →'}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setEmailChecked(false); setIsExistingClient(false)
                    setExistingClientData(null); setFlowStep(0)
                    setFirstName(''); setLastName(''); setMedicalNotes('')
                    setOtpSent(false); setOtpVerified(false); setOtpInput(''); setOtpError(null); setResendCooldown(0)
                    resetSlots(); setSelTattoo(''); setSelWorker(''); setSelDate(today)
                  }}
                  className="text-[10px] uppercase tracking-[0.2em] text-white/30 hover:text-white/60 transition-colors"
                >
                  ← Change email
                </button>
              )}
            </div>

            {/* ── STEP 1: Personal Info (new users only) ── */}
            <div className={`border-x border-white/10 transition-all duration-300 ${flowStep >= 1 && !isExistingClient ? 'opacity-100' : 'opacity-0 pointer-events-none h-0 overflow-hidden'}`}>
              <div className="bg-[#161616] px-8 py-6 space-y-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <StepBadge n={2} active={flowStep >= 1 && !isExistingClient} />
                  <div>
                    <p className="text-[13px] text-white/80 font-medium">Your information</p>
                    <p className="text-[11px] text-white/30">Tell us a bit about yourself</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className={labelCls}>First Name</label>
                    <input
                      value={firstName}
                      onChange={e => { setFirstName(e.target.value); setNameErrors(p => ({ ...p, first_name: undefined })) }}
                      className={inputCls}
                      placeholder="John"
                    />
                    <FieldError msg={nameErrors.first_name} />
                  </div>
                  <div>
                    <label className={labelCls}>Last Name</label>
                    <input
                      value={lastName}
                      onChange={e => { setLastName(e.target.value); setNameErrors(p => ({ ...p, last_name: undefined })) }}
                      className={inputCls}
                      placeholder="Doe"
                    />
                    <FieldError msg={nameErrors.last_name} />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>
                    Medical Notes
                    <span className="ml-2 text-white/20 normal-case tracking-normal font-normal">optional</span>
                  </label>
                  <textarea
                    value={medicalNotes}
                    onChange={e => setMedicalNotes(e.target.value)}
                    rows={2}
                    className="w-full border border-white/10 bg-transparent rounded-sm p-3 text-[13px] text-white/90 outline-none transition-all focus:border-[#ff5a66] placeholder:text-white/20 resize-none"
                    placeholder="Allergies, skin conditions, contraindications..."
                  />
                </div>

                {flowStep === 1 && (
                  <button
                    type="button"
                    onClick={handlePersonalInfoContinue}
                    className="w-full h-11 bg-[#ff5a66] hover:bg-[#ff7078] text-black text-[10px] font-bold uppercase tracking-[0.3em] rounded-sm transition-all"
                  >
                    Continue →
                  </button>
                )}
              </div>
            </div>

            {/* ── STEP 2: Session (tattoo + worker + date) ── */}
            <div className={`border-x border-white/10 transition-all duration-300 ${flowStep >= 2 ? 'opacity-100' : 'opacity-0 pointer-events-none h-0 overflow-hidden'}`}>
              <div className="bg-[#1a1a1a] px-8 py-6 space-y-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <StepBadge n={isExistingClient ? 2 : 3} active={flowStep >= 2} />
                  <div>
                    <p className="text-[13px] text-white/80 font-medium">Choose your session</p>
                    <p className="text-[11px] text-white/30">Design, artist and date</p>
                  </div>
                </div>

                {/* Tattoo */}
                <div>
                  <label className={labelCls}>Tattoo Design</label>
                  <div className="relative">
                    <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 pointer-events-none" />
                    <select
                      value={selTattoo}
                      onChange={e => { setSelTattoo(e.target.value ? Number(e.target.value) : ''); resetSlots() }}
                      className={`${selectCls} pl-10`}
                    >
                      <option value="">Select a design...</option>
                      {tattoos.map(t => (
                        <option key={t.tattoo_id} value={t.tattoo_id}>
                          {t.name} — {t.time}h — ${t.cost}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 pointer-events-none" />
                  </div>
                  {selectedTattoo && (
                    <div className="mt-2 flex items-center gap-4 text-[11px]">
                      <span className="text-white/40">Duration: <span className="text-white/70">{selectedTattoo.time}h</span></span>
                      <span className="text-white/20">·</span>
                      <span className="text-white/40">Cost: <span className="text-[#ff5a66]">${selectedTattoo.cost}</span></span>
                    </div>
                  )}
                </div>

                {/* Worker + Date */}
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className={labelCls}>Artist</label>
                    <div className="relative">
                      <User2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 pointer-events-none" />
                      <select
                        value={selWorker}
                        onChange={e => { setSelWorker(e.target.value ? Number(e.target.value) : ''); resetSlots() }}
                        className={`${selectCls} pl-10`}
                      >
                        <option value="">Select artist...</option>
                        {workers.map(w => (
                          <option key={w.worker_id} value={w.worker_id}>
                            {w.first_name} {w.last_name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 pointer-events-none" />
                      <input
                        type="date"
                        value={selDate}
                        min={today}
                        onChange={e => { setSelDate(e.target.value); resetSlots() }}
                        className={`${selectCls} pl-10 scheme-dark`}
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={fetchSlots}
                  disabled={!sessionReady || blocksLoading}
                  className="w-full h-11 bg-white/5 hover:bg-white/8 border border-white/10 hover:border-[#ff5a66]/40 text-white/50 hover:text-white/90 text-[10px] font-bold uppercase tracking-[0.3em] rounded-sm disabled:opacity-30 transition-all"
                >
                  {blocksLoading ? 'Checking availability...' : 'Check Available Slots →'}
                </button>
              </div>
            </div>

            {/* ── STEP 3: Slot selection ── */}
            <div className={`border-x border-white/10 transition-all duration-300 ${flowStep >= 3 && blocksReady ? 'opacity-100' : 'opacity-0 pointer-events-none h-0 overflow-hidden'}`}>
              <div className="bg-[#161616] px-8 py-6 space-y-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <StepBadge n={isExistingClient ? 3 : 4} active={flowStep >= 3 && blocksReady} />
                  <div>
                    <p className="text-[13px] text-white/80 font-medium">Pick a time slot</p>
                    <p className="text-[11px] text-white/30">
                      {slots.length > 0 ? `${slots.length} slots available` : 'No slots available'}
                    </p>
                  </div>
                </div>

                {blocksReady && slots.length === 0 ? (
                  <div className="flex items-start gap-3 bg-yellow-500/5 border border-yellow-500/15 rounded-sm px-4 py-3">
                    <AlertCircle className="w-4 h-4 text-yellow-400/80 shrink-0 mt-0.5" />
                    <p className="text-[12px] text-yellow-400/80">
                      No available slots for this artist on this day.
                      {blocks.length === 0 && ' The artist may not work on this day.'}
                    </p>
                  </div>
                ) : (
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 pointer-events-none" />
                    <select
                      value={selSlotIdx}
                      onChange={e => {
                        setSelSlotIdx(e.target.value !== '' ? Number(e.target.value) : '')
                        if (e.target.value !== '') setFlowStep(4)
                      }}
                      className={`${selectCls} pl-10`}
                    >
                      <option value="">Select a time...</option>
                      {slots.map((s, i) => (
                        <option key={i} value={i}>
                          {to12h(s.start)} – {to12h(s.end)}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 pointer-events-none" />
                  </div>
                )}
              </div>
            </div>

            {/* ── STEP 4: Confirmation ── */}
            <div className={`border-x border-b border-white/10 rounded-b-sm transition-all duration-300 ${flowStep >= 4 && selSlotIdx !== '' ? 'opacity-100' : 'opacity-0 pointer-events-none h-0 overflow-hidden'}`}>
              <div className="bg-[#1a1a1a] px-8 py-6 space-y-6">
                <div className="flex items-center gap-3">
                  <StepBadge n={isExistingClient ? 4 : 5} active={flowStep >= 4} />
                  <div>
                    <p className="text-[13px] text-white/80 font-medium">Confirm your booking</p>
                    <p className="text-[11px] text-white/30">Review your details before confirming</p>
                  </div>
                </div>

                {/* Summary card */}
                <div className="bg-[#111] border border-white/8 rounded-sm divide-y divide-white/8">
                  <div className="flex justify-between items-center px-4 py-3">
                    <span className="text-[10px] uppercase tracking-[0.25em] text-white/30">Client</span>
                    <span className="text-[13px] text-white/80">
                      {isExistingClient
                        ? `${existingClientData?.first_name} ${existingClientData?.last_name}`
                        : `${firstName} ${lastName}`
                      }
                    </span>
                  </div>
                  <div className="flex justify-between items-center px-4 py-3">
                    <span className="text-[10px] uppercase tracking-[0.25em] text-white/30">Email</span>
                    <span className="text-[13px] text-white/60">{emailInput}</span>
                  </div>
                  {selectedTattoo && (
                    <div className="flex justify-between items-center px-4 py-3">
                      <span className="text-[10px] uppercase tracking-[0.25em] text-white/30">Design</span>
                      <span className="text-[13px] text-white/80">{selectedTattoo.name}</span>
                    </div>
                  )}
                  {selectedWorker && (
                    <div className="flex justify-between items-center px-4 py-3">
                      <span className="text-[10px] uppercase tracking-[0.25em] text-white/30">Artist</span>
                      <span className="text-[13px] text-white/80">{selectedWorker.first_name} {selectedWorker.last_name}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center px-4 py-3">
                    <span className="text-[10px] uppercase tracking-[0.25em] text-white/30">Date</span>
                    <span className="text-[13px] text-white/80">
                      {new Date(selDate + 'T00:00:00').toLocaleDateString('en-US', {
                        weekday: 'short', month: 'long', day: 'numeric', year: 'numeric'
                      })}
                    </span>
                  </div>
                  {selectedSlot && (
                    <div className="flex justify-between items-center px-4 py-3">
                      <span className="text-[10px] uppercase tracking-[0.25em] text-white/30">Time</span>
                      <span className="text-[13px] text-[#ff5a66] font-medium">
                        {to12h(selectedSlot.start)} – {to12h(selectedSlot.end)}
                      </span>
                    </div>
                  )}
                  {selectedTattoo && (
                    <div className="flex justify-between items-center px-4 py-3">
                      <span className="text-[10px] uppercase tracking-[0.25em] text-white/30">Cost</span>
                      <span className="text-[13px] text-[#ff5a66] font-semibold">${selectedTattoo.cost}</span>
                    </div>
                  )}
                </div>

                {/* API error */}
                {apiError && (
                  <div className="flex items-start gap-3 bg-red-500/5 border border-red-500/20 rounded-sm px-4 py-3">
                    <AlertCircle className="w-4 h-4 text-red-400/80 shrink-0 mt-0.5" />
                    <p className="text-[12px] text-red-400/80">{apiError}</p>
                  </div>
                )}

                {/* Hidden email field for react-hook-form */}
                <input type="hidden" {...register('email')} value={emailInput} />

                {/* Confirm button */}
                <button
                  type="button"
                  onClick={() => onSubmit({ email: emailInput })}
                  disabled={submitting}
                  className="w-full h-12 bg-[#ff5a66] hover:bg-[#ff7078] text-black text-[10px] font-bold uppercase tracking-[0.3em] rounded-sm disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <><span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-black/30 border-t-black" /> Confirming…</>
                  ) : (
                    <><CheckCircle className="w-4 h-4" /> Confirm Appointment</>
                  )}
                </button>

                <p className="text-center text-[10px] text-white/20">
                  By confirming, you agree to our cancellation policy.
                </p>
              </div>
            </div>

          </form>
        </div>
      </div>
    </Scrollable>
  )
}
