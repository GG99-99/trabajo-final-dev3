import { useState, useEffect } from 'react'
import Scrollable from '@/componentes/Scrollable'
import { Button } from '@/componentes/ui/button'
import {
  Clock, Plus, X, ChevronDown, RefreshCw,
  CheckCircle, XCircle, Coffee, UserCircle, Armchair
} from 'lucide-react'
import { scheduleService, type Schedule } from '@/lib/schedule.service'
import { workerService } from '@/lib/people.service'
import { seatService, type Seat } from '@/lib/seat.service'
import type { WorkerPublic, ScheduleJsonDay, ScheduleDayOfWeek } from '@final/shared'

// ── constants ──────────────────────────────────────────────────────────────
const DAYS: { key: ScheduleDayOfWeek; label: string }[] = [
  { key: 'monday',    label: 'Monday' },
  { key: 'tuesday',   label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday',  label: 'Thursday' },
  { key: 'friday',    label: 'Friday' },
  { key: 'saturday',  label: 'Saturday' },
  { key: 'sunday',    label: 'Sunday' },
]

const DEFAULT_DAY: ScheduleJsonDay = {
  start: '09:00',
  end: '18:00',
  active: false,
  breaks: [],
}

const labelCls  = "block text-[9px] font-semibold uppercase tracking-[0.3em] text-white/30 mb-2"
const inputCls  = "bg-[#0a0a0a] border border-white/10 text-white/80 text-[13px] px-3 py-2 rounded-sm outline-none focus:border-[#ff5a66] transition-colors [color-scheme:dark]"

// ── helpers ────────────────────────────────────────────────────────────────
function emptySchedule(): Record<ScheduleDayOfWeek, ScheduleJsonDay> {
  return Object.fromEntries(DAYS.map(d => [d.key, { ...DEFAULT_DAY, breaks: [] }])) as Record<ScheduleDayOfWeek, ScheduleJsonDay>
}

function scheduleToForm(s: Schedule): Record<ScheduleDayOfWeek, ScheduleJsonDay> {
  return Object.fromEntries(
    DAYS.map(d => [d.key, s[d.key] as ScheduleJsonDay])
  ) as Record<ScheduleDayOfWeek, ScheduleJsonDay>
}

// ── component ──────────────────────────────────────────────────────────────
export default function WorkerSchedule() {
  const [workers, setWorkers]           = useState<WorkerPublic[]>([])
  const [seats, setSeats]               = useState<Seat[]>([])
  const [selectedWorker, setSelectedWorker] = useState<number | ''>('')
  const [activeSchedule, setActiveSchedule] = useState<Schedule | null>(null)
  const [history, setHistory]           = useState<Schedule[]>([])
  const [loading, setLoading]           = useState(false)
  const [showForm, setShowForm]         = useState(false)
  const [submitting, setSubmitting]     = useState(false)
  const [apiError, setApiError]         = useState<string | null>(null)

  // form state
  const [selectedSeat, setSelectedSeat] = useState<number | ''>('')
  const [days, setDays] = useState<Record<ScheduleDayOfWeek, ScheduleJsonDay>>(emptySchedule())

  useEffect(() => {
    async function init() {
      const [wRes, sRes] = await Promise.all([workerService.getAll(), seatService.getMany()])
      if (wRes.ok) setWorkers(wRes.data)
      if (sRes.ok) setSeats(sRes.data)
    }
    init()
  }, [])

  useEffect(() => {
    if (!selectedWorker) { setActiveSchedule(null); setHistory([]); return }
    loadSchedules(Number(selectedWorker))
  }, [selectedWorker])

  async function loadSchedules(worker_id: number) {
    setLoading(true)
    const [activeRes, allRes] = await Promise.all([
      scheduleService.getActive(worker_id),
      scheduleService.getMany({ worker_id }),
    ])
    setActiveSchedule(activeRes.ok ? activeRes.data : null)
    setHistory(allRes.ok ? allRes.data : [])
    setLoading(false)
  }

  // ── day helpers ────────────────────────────────────────────────────────
  const setDay = (key: ScheduleDayOfWeek, patch: Partial<ScheduleJsonDay>) =>
    setDays(prev => ({ ...prev, [key]: { ...prev[key], ...patch } }))

  const addBreak = (key: ScheduleDayOfWeek) =>
    setDay(key, { breaks: [...days[key].breaks, { start: '12:00', end: '13:00' }] })

  const removeBreak = (key: ScheduleDayOfWeek, idx: number) =>
    setDay(key, { breaks: days[key].breaks.filter((_, i) => i !== idx) })

  const updateBreak = (key: ScheduleDayOfWeek, idx: number, field: 'start' | 'end', val: string) => {
    const updated = [...days[key].breaks]
    updated[idx] = { ...updated[idx], [field]: val }
    setDay(key, { breaks: updated })
  }

  // ── open form pre-filled with active schedule ──────────────────────────
  const openForm = () => {
    if (activeSchedule) {
      setDays(scheduleToForm(activeSchedule))
      setSelectedSeat(activeSchedule.seat_id)
    } else {
      setDays(emptySchedule())
      setSelectedSeat('')
    }
    setApiError(null)
    setShowForm(true)
  }

  // ── submit ─────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!selectedWorker || !selectedSeat) {
      setApiError('Select a worker and a seat.')
      return
    }
    setSubmitting(true)
    setApiError(null)
    const res = await scheduleService.create({
      worker_id: Number(selectedWorker),
      seat_id:   Number(selectedSeat),
      ...days,
    })
    setSubmitting(false)
    if (!res.ok) { setApiError(res.error.message); return }
    setShowForm(false)
    loadSchedules(Number(selectedWorker))
  }

  // ── deactivate ─────────────────────────────────────────────────────────
  const handleDeactivate = async (schedule_id: number) => {
    await scheduleService.setInactive(schedule_id)
    loadSchedules(Number(selectedWorker))
  }

  const worker = workers.find(w => w.worker_id === Number(selectedWorker))

  return (
    <div className="h-full flex flex-col">

      {/* ── TOP BAR ── */}
      <div className="shrink-0 px-8 pt-8 pb-6 flex items-center justify-between">
        <div>
          <h1
            className="text-[48px] font-light text-white/95 leading-none"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Schedules
          </h1>
          <p className="text-[11px] uppercase tracking-[0.25em] text-white/40 mt-2">
            Configure weekly schedules per worker
          </p>
        </div>
        <div className="flex items-center gap-3">
          {selectedWorker && (
            <Button
              variant="ghost"
              onClick={() => loadSchedules(Number(selectedWorker))}
              className="text-white/40 hover:text-white hover:bg-white/5"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          )}
          {selectedWorker && (
            <Button
              onClick={openForm}
              className="h-10 bg-[#ff5a66] hover:bg-[#ff7078] text-black text-[10px] font-bold uppercase tracking-[0.3em] rounded-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Schedule
            </Button>
          )}
        </div>
      </div>

      {/* ── WORKER SELECTOR ── */}
      <div className="shrink-0 px-8 pb-6">
        <div className="relative max-w-sm">
          <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
          <select
            value={selectedWorker}
            onChange={e => setSelectedWorker(e.target.value ? Number(e.target.value) : '')}
            className="w-full bg-[#1a1a1a] border border-white/10 text-white/80 text-[13px] pl-10 pr-8 py-2.5 rounded-sm outline-none focus:border-[#ff5a66] cursor-pointer appearance-none [&>option]:bg-[#1a1a1a] transition-colors"
          >
            <option value="">Select a worker...</option>
            {workers.map(w => (
              <option key={w.worker_id} value={w.worker_id}>
                {w.first_name} {w.last_name} — {w.specialty}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
        </div>
      </div>

      <Scrollable className="flex-1 min-h-0 px-8 pb-8">
        {!selectedWorker ? (
          <div className="py-24 text-center">
            <Clock className="w-12 h-12 text-white/10 mx-auto mb-4" />
            <p className="text-white/30 text-sm">Select a worker to view their schedule</p>
          </div>
        ) : loading ? (
          <div className="py-24 text-center text-white/30 text-sm">Loading...</div>
        ) : (
          <div className="space-y-8">

            {/* ── ACTIVE SCHEDULE ── */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[10px] uppercase tracking-[0.3em] text-white/40">Active Schedule</span>
                {activeSchedule && (
                  <span className="text-[9px] uppercase tracking-[0.2em] px-2 py-0.5 bg-[#ff5a66]/10 text-[#ff5a66] border border-[#ff5a66]/20 rounded-full">
                    Live
                  </span>
                )}
              </div>

              {!activeSchedule ? (
                <div className="bg-[#1a1a1a] border border-white/10 rounded-sm p-8 text-center">
                  <p className="text-white/30 text-sm mb-4">
                    {worker?.first_name} has no active schedule.
                  </p>
                  <Button
                    onClick={openForm}
                    className="h-10 bg-[#ff5a66] hover:bg-[#ff7078] text-black text-[10px] font-bold uppercase tracking-[0.3em] rounded-sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Schedule
                  </Button>
                </div>
              ) : (
                <ScheduleCard
                  schedule={activeSchedule}
                  onDeactivate={() => handleDeactivate(activeSchedule.schedule_id)}
                  seats={seats}
                  isActive
                />
              )}
            </div>

            {/* ── HISTORY ── */}
            {history.filter(s => !s.active).length > 0 && (
              <div>
                <span className="text-[10px] uppercase tracking-[0.3em] text-white/40 block mb-4">
                  History
                </span>
                <div className="space-y-3">
                  {history.filter(s => !s.active).map(s => (
                    <ScheduleCard key={s.schedule_id} schedule={s} seats={seats} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Scrollable>

      {/* ── CREATE / EDIT MODAL ── */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-sm w-full max-w-3xl mx-4 flex flex-col max-h-[92vh]">

            {/* header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-white/10 shrink-0">
              <div>
                <h2
                  className="text-[28px] font-light text-white/95"
                  style={{ fontFamily: 'Cormorant Garamond, serif' }}
                >
                  {activeSchedule ? 'Update Schedule' : 'New Schedule'}
                </h2>
                <p className="text-[11px] text-white/40 mt-1">
                  {worker?.first_name} {worker?.last_name}
                  {activeSchedule && ' — replaces current active schedule'}
                </p>
              </div>
              <button
                onClick={() => setShowForm(false)}
                className="text-white/40 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <Scrollable className="flex-1 min-h-0">
              <div className="px-8 py-6 space-y-8">

                {/* seat selector */}
                <div>
                  <label className={labelCls}>Seat / Station</label>
                  <div className="relative">
                    <Armchair className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                    <select
                      value={selectedSeat}
                      onChange={e => setSelectedSeat(e.target.value ? Number(e.target.value) : '')}
                      className="w-full bg-[#0a0a0a] border border-white/10 text-white/80 text-[13px] pl-10 pr-8 py-2.5 rounded-sm outline-none focus:border-[#ff5a66] cursor-pointer appearance-none [&>option]:bg-[#1a1a1a] transition-colors"
                    >
                      <option value="">Select seat...</option>
                      {seats.map(s => (
                        <option key={s.seat_id} value={s.seat_id}>{s.seat_code}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                  </div>
                </div>

                {/* days */}
                <div className="space-y-4">
                  <label className={labelCls}>Weekly Schedule</label>
                  {DAYS.map(({ key, label }) => (
                    <DayEditor
                      key={key}
                      label={label}
                      day={days[key]}
                      onChange={patch => setDay(key, patch)}
                      onAddBreak={() => addBreak(key)}
                      onRemoveBreak={idx => removeBreak(key, idx)}
                      onUpdateBreak={(idx, field, val) => updateBreak(key, idx, field, val)}
                    />
                  ))}
                </div>

                {apiError && (
                  <p className="text-[10px] uppercase tracking-wider text-[#ff5a66] border border-[#ff5a66]/20 bg-[#ff5a66]/5 px-4 py-3">
                    {apiError}
                  </p>
                )}

                <div className="flex gap-3 pt-2 pb-2">
                  <Button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="flex-1 h-12 bg-[#ff5a66] hover:bg-[#ff7078] text-black text-[10px] font-bold uppercase tracking-[0.3em] rounded-sm"
                  >
                    {submitting ? 'Saving...' : activeSchedule ? 'Update Schedule' : 'Create Schedule'}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setShowForm(false)}
                    className="h-12 px-6 border border-white/10 text-white/40 hover:text-white hover:border-white/20 text-[10px] uppercase tracking-[0.2em] rounded-sm"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </Scrollable>
          </div>
        </div>
      )}
    </div>
  )
}

// ── ScheduleCard ────────────────────────────────────────────────────────────
function ScheduleCard({
  schedule, seats, isActive = false, onDeactivate
}: {
  schedule: Schedule
  seats: Seat[]
  isActive?: boolean
  onDeactivate?: () => void
}) {
  const seat = seats.find(s => s.seat_id === schedule.seat_id)
  const created = new Date(schedule.created_at).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  })
  const validUntil = schedule.valid_until
    ? new Date(schedule.valid_until).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : null

  return (
    <div className={`bg-[#1a1a1a] border rounded-sm overflow-hidden ${isActive ? 'border-[#ff5a66]/30' : 'border-white/10 opacity-60'}`}>
      {/* card header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <div className="flex items-center gap-4">
          <div>
            <p className="text-white/80 text-sm font-medium">
              Schedule #{schedule.schedule_id}
            </p>
            <p className="text-[10px] uppercase tracking-[0.15em] text-white/40 mt-0.5">
              Seat: {seat?.seat_code ?? `#${schedule.seat_id}`} · Created {created}
              {validUntil && ` · Expired ${validUntil}`}
            </p>
          </div>
        </div>
        {isActive && onDeactivate && (
          <Button
            variant="ghost"
            onClick={onDeactivate}
            className="text-[9px] uppercase tracking-[0.2em] text-white/30 hover:text-red-400 hover:bg-red-400/5 border border-white/10 hover:border-red-400/20 h-8 px-3 rounded-sm"
          >
            Deactivate
          </Button>
        )}
      </div>

      {/* days grid */}
      <div className="grid grid-cols-7 divide-x divide-white/10">
        {DAYS.map(({ key, label }) => {
          const day = schedule[key] as ScheduleJsonDay
          return (
            <div key={key} className={`p-3 ${!day.active ? 'opacity-40' : ''}`}>
              <p className="text-[9px] uppercase tracking-[0.2em] text-white/50 mb-2">{label.slice(0, 3)}</p>
              {day.active ? (
                <>
                  <div className="flex items-center gap-1 mb-1">
                    <CheckCircle className="w-3 h-3 text-[#ff5a66] shrink-0" />
                    <span className="text-[11px] text-white/80">{day.start}</span>
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    <XCircle className="w-3 h-3 text-white/30 shrink-0" />
                    <span className="text-[11px] text-white/80">{day.end}</span>
                  </div>
                  {day.breaks.length > 0 && (
                    <div className="space-y-1">
                      {day.breaks.map((b, i) => (
                        <div key={i} className="flex items-center gap-1">
                          <Coffee className="w-3 h-3 text-yellow-400/60 shrink-0" />
                          <span className="text-[10px] text-white/40">{b.start}–{b.end}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <span className="text-[10px] text-white/30">Off</span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── DayEditor ───────────────────────────────────────────────────────────────
function DayEditor({
  label, day, onChange, onAddBreak, onRemoveBreak, onUpdateBreak
}: {
  label: string
  day: ScheduleJsonDay
  onChange: (patch: Partial<ScheduleJsonDay>) => void
  onAddBreak: () => void
  onRemoveBreak: (idx: number) => void
  onUpdateBreak: (idx: number, field: 'start' | 'end', val: string) => void
}) {
  return (
    <div className={`border rounded-sm transition-colors ${day.active ? 'border-white/15 bg-black/20' : 'border-white/8 bg-transparent opacity-60'}`}>
      {/* day toggle row */}
      <div className="flex items-center gap-4 px-5 py-4">
        <button
          type="button"
          onClick={() => onChange({ active: !day.active })}
          className={`w-10 h-5 rounded-full transition-colors relative shrink-0 ${day.active ? 'bg-[#ff5a66]' : 'bg-white/10'}`}
        >
          <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${day.active ? 'left-5' : 'left-0.5'}`} />
        </button>
        <span className="text-[11px] uppercase tracking-[0.2em] text-white/70 w-24 shrink-0">{label}</span>

        {day.active && (
          <div className="flex items-center gap-3 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-[9px] uppercase tracking-[0.2em] text-white/30">From</span>
              <input
                type="time"
                value={day.start}
                onChange={e => onChange({ start: e.target.value })}
                className={`${inputCls} w-32`}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] uppercase tracking-[0.2em] text-white/30">To</span>
              <input
                type="time"
                value={day.end}
                onChange={e => onChange({ end: e.target.value })}
                className={`${inputCls} w-32`}
              />
            </div>
            <button
              type="button"
              onClick={onAddBreak}
              className="ml-auto flex items-center gap-1.5 text-[9px] uppercase tracking-[0.2em] text-white/30 hover:text-yellow-400 transition-colors"
            >
              <Coffee className="w-3.5 h-3.5" />
              Add break
            </button>
          </div>
        )}
      </div>

      {/* breaks */}
      {day.active && day.breaks.length > 0 && (
        <div className="px-5 pb-4 space-y-2 border-t border-white/8 pt-3">
          {day.breaks.map((b, i) => (
            <div key={i} className="flex items-center gap-3">
              <Coffee className="w-3.5 h-3.5 text-yellow-400/60 shrink-0" />
              <span className="text-[9px] uppercase tracking-[0.2em] text-white/30 w-12">Break</span>
              <input
                type="time"
                value={b.start}
                onChange={e => onUpdateBreak(i, 'start', e.target.value)}
                className={`${inputCls} w-28`}
              />
              <span className="text-white/20 text-xs">–</span>
              <input
                type="time"
                value={b.end}
                onChange={e => onUpdateBreak(i, 'end', e.target.value)}
                className={`${inputCls} w-28`}
              />
              <button
                type="button"
                onClick={() => onRemoveBreak(i)}
                className="ml-auto text-white/20 hover:text-red-400 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
