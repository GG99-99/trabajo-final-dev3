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
  AlertCircle, ArrowLeft, Sparkles, User2
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
  first_name:    yup.string().required('Required'),
  last_name:     yup.string().required('Required'),
  email:         yup.string().email('Invalid email').required('Required'),
  medical_notes: yup.string(),
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
  const [tattoos, setTattoos] = useState<Tattoo[]>([])
  const [workers, setWorkers] = useState<PublicWorker[]>([])
  const [blocks,  setBlocks]  = useState<AppointmentBlockTime[]>([])
  const [slots,   setSlots]   = useState<{ start: string; end: string }[]>([])

  const [selTattoo,  setSelTattoo]  = useState<number | ''>('')
  const [selWorker,  setSelWorker]  = useState<number | ''>('')
  const [selDate,    setSelDate]    = useState(today)
  const [selSlotIdx, setSelSlotIdx] = useState<number | ''>('')

  const [blocksLoading, setBlocksLoading] = useState(false)
  const [blocksReady,   setBlocksReady]   = useState(false)
  const [submitting,    setSubmitting]    = useState(false)
  const [apiError,      setApiError]      = useState<string | null>(null)
  const [success,       setSuccess]       = useState(false)

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema),
  })
  const watchedEmail = watch('email')

  useEffect(() => {
    Promise.all([publicService.getTattoos(), publicService.getWorkers()]).then(([t, w]) => {
      if (t.ok) setTattoos(t.data)
      if (w.ok) setWorkers(w.data)
    })
  }, [])

  const selectedTattoo = tattoos.find(t => t.tattoo_id === Number(selTattoo))
  const selectedWorker = workers.find(w => w.worker_id === Number(selWorker))
  const selectedSlot   = slots[Number(selSlotIdx)]
  const step1Ready     = selTattoo && selWorker && selDate

  const resetSlots = () => {
    setBlocksReady(false)
    setSlots([])
    setSelSlotIdx('')
    setBlocks([])
  }

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
  }

  const onSubmit = async (data: FormData) => {
    if (!selTattoo || !selWorker || selSlotIdx === '') {
      setApiError('Please complete all booking fields.')
      return
    }
    const slot = slots[Number(selSlotIdx)]
    if (!slot) { setApiError('Invalid slot.'); return }

    setSubmitting(true)
    setApiError(null)
    const res = await publicService.book({
      ...data,
      worker_id: Number(selWorker),
      tattoo_id: Number(selTattoo),
      date:      selDate,
      start:     slot.start,
      end:       slot.end,
    })
    setSubmitting(false)
    if (!res.ok) { setApiError(res.error.message); return }
    setSuccess(true)
    reset()
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
            </div>
            <div className="h-px bg-white/10" />
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setSuccess(false)}
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

        {/* back link */}
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

          {/* ── STEP 1 ── */}
          <div className="bg-[#1a1a1a] border border-white/10 rounded-sm p-8 space-y-6">
            <div className="flex items-center gap-3">
              <StepBadge n={1} active={true} />
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
              disabled={!step1Ready || blocksLoading}
              className="w-full h-11 bg-white/5 hover:bg-white/8 border border-white/10 hover:border-[#ff5a66]/40 text-white/50 hover:text-white/90 text-[10px] font-bold uppercase tracking-[0.3em] rounded-sm disabled:opacity-30 transition-all"
            >
              {blocksLoading ? 'Checking availability...' : 'Check Available Slots →'}
            </button>
          </div>

          {/* ── STEP 2 ── */}
          <div className={`border-x border-white/10 transition-all duration-300 ${blocksReady ? 'opacity-100' : 'opacity-0 pointer-events-none h-0 overflow-hidden'}`}>
            <div className="bg-[#161616] px-8 py-6 space-y-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <StepBadge n={2} active={blocksReady} />
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
                    onChange={e => setSelSlotIdx(e.target.value !== '' ? Number(e.target.value) : '')}
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

          {/* ── STEP 3 ── */}
          <div className={`border-x border-white/10 transition-all duration-300 ${selSlotIdx !== '' ? 'opacity-100' : 'opacity-0 pointer-events-none h-0 overflow-hidden'}`}>
            <div className="bg-[#1a1a1a] px-8 py-6 space-y-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <StepBadge n={3} active={selSlotIdx !== ''} />
                <div>
                  <p className="text-[13px] text-white/80 font-medium">Your information</p>
                  <p className="text-[11px] text-white/30">Name and contact details</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className={labelCls}>First Name</label>
                  <input {...register('first_name')} className={inputCls} placeholder="John" />
                  <FieldError msg={errors.first_name?.message} />
                </div>
                <div>
                  <label className={labelCls}>Last Name</label>
                  <input {...register('last_name')} className={inputCls} placeholder="Doe" />
                  <FieldError msg={errors.last_name?.message} />
                </div>
              </div>

              <div>
                <label className={labelCls}>Email Address</label>
                <input {...register('email')} type="email" className={inputCls} placeholder="you@example.com" />
                <FieldError msg={errors.email?.message} />
              </div>

              <div>
                <label className={labelCls}>
                  Medical Notes
                  <span className="ml-2 text-white/20 normal-case tracking-normal font-normal">optional</span>
                </label>
                <textarea
                  {...register('medical_notes')}
                  rows={2}
                  className="w-full border border-white/10 bg-transparent rounded-sm p-3 text-[13px] text-white/90 outline-none transition-all focus:border-[#ff5a66] placeholder:text-white/20 resize-none"
                  placeholder="Allergies, skin conditions, contraindications..."
                />
              </div>
            </div>
          </div>

          {/* ── SUMMARY + SUBMIT ── */}
          {selSlotIdx !== '' && (
            <div className="bg-[#161616] border border-white/10 rounded-b-sm px-8 py-6 space-y-6">
              {/* summary */}
              <div className="space-y-2.5">
                <p className="text-[9px] uppercase tracking-[0.3em] text-white/30 mb-4">Booking Summary</p>
                {[
                  ['Design',  selectedTattoo ? `${selectedTattoo.name}` : '—'],
                  ['Duration', selectedTattoo ? `${selectedTattoo.time}h` : '—'],
                  ['Artist',  selectedWorker ? `${selectedWorker.first_name} ${selectedWorker.last_name}` : '—'],
                  ['Date',    new Date(selDate + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })],
                  ['Time',    selectedSlot ? `${to12h(selectedSlot.start)} – ${to12h(selectedSlot.end)}` : '—'],
                  ['Cost',    selectedTattoo ? `$${selectedTattoo.cost}` : '—'],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between items-baseline">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-white/30">{k}</span>
                    <span className="text-[13px] text-white/80">{v}</span>
                  </div>
                ))}
              </div>

              <div className="h-px bg-white/10" />

              {apiError && (
                <div className="flex items-start gap-3 bg-red-500/5 border border-red-500/20 rounded-sm px-4 py-3">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <p className="text-[12px] text-red-400">{apiError}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting || !watchedEmail}
                className="w-full h-14 bg-[#ff5a66] hover:bg-[#ff7078] text-black text-[10px] font-bold uppercase tracking-[0.35em] rounded-sm disabled:opacity-40 transition-colors"
              >
                {submitting ? 'Confirming...' : 'Confirm Appointment'}
              </button>

              <p className="text-center text-[10px] text-white/20 leading-relaxed">
                One appointment per person per day · One booking per location per day
              </p>
            </div>
          )}

        </form>
      </div>
    </div>
    </Scrollable>
  )
}
