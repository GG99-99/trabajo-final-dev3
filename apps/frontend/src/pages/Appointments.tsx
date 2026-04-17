import { useState, useEffect } from 'react'
import Scrollable from '@/componentes/Scrollable'
import Tooltip from '@/componentes/Tooltip'
import { Button } from '@/componentes/ui/button'
import {
  Calendar, Plus, X, Clock, User,
  UserCircle, Filter, RefreshCw, ChevronDown
} from 'lucide-react'
import { appointmentService, type Appointment, type AppointmentStatus } from '@/lib/appointment.service'
import { workerService, clientService } from '@/lib/people.service'
import { tattooService, type Tattoo } from '@/lib/tattoo.service'
import type { WorkerPublic, ClientPublic, AppointmentBlockTime } from '@final/shared'

// ── helpers ────────────────────────────────────────────────────────────────
const pad = (n: number) => String(n).padStart(2, '0')
const toDateStr = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
const today = toDateStr(new Date())

/** Convert "HH:MM" 24h → "H:MM AM/PM" */
const to12h = (t: string) => {
  const [h, m] = t.split(':').map(Number)
  const period = (h ?? 0) >= 12 ? 'PM' : 'AM'
  const hour   = (h ?? 0) % 12 || 12
  return `${hour}:${pad(m ?? 0)} ${period}`
}

/** Format a time range with AM/PM */
const timeRange = (start: string, end: string) => `${to12h(start)} – ${to12h(end)}`
const timeToMinutes = (t: string) => {
  const [h, m] = t.split(':').map(Number)
  return (h ?? 0) * 60 + (m ?? 0)
}

/** Add minutes to "HH:MM" string → "HH:MM" */
const addMinutes = (time: string, mins: number) => {
  const total = timeToMinutes(time) + mins
  return `${pad(Math.floor(total / 60))}:${pad(total % 60)}`
}

/** Generate slots of `duration` minutes inside a block */
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

/** Filter out slots that have already passed (only for today) */
function filterPastSlots(
  slots: { start: string; end: string }[],
  date: string
): { start: string; end: string }[] {
  const todayStr = toDateStr(new Date())
  if (date !== todayStr) return slots

  const now = new Date()
  const currentMins = now.getHours() * 60 + now.getMinutes()

  return slots.filter(s => timeToMinutes(s.start) > currentMins)
}

const STATUS_STYLES: Record<AppointmentStatus, string> = {
  pending:   'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  completed: 'bg-[#ff5a66]/10 text-[#ff5a66] border-[#ff5a66]/20',
  expired:   'bg-white/5 text-white/30 border-white/10',
  cancelled: 'bg-red-900/20 text-red-400 border-red-500/20',
}
const ALL_STATUSES: AppointmentStatus[] = ['pending', 'completed', 'expired', 'cancelled']

const selectCls = "w-full bg-[#0a0a0a] border border-white/10 text-white/80 text-[13px] px-3 py-2.5 rounded-sm outline-none focus:border-[#ff5a66] cursor-pointer appearance-none [&>option]:bg-[#1a1a1a] transition-colors"
const labelCls  = "block text-[9px] font-semibold uppercase tracking-[0.3em] text-white/30 mb-2"

// ── component ──────────────────────────────────────────────────────────────
export default function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [workers, setWorkers]           = useState<WorkerPublic[]>([])
  const [clients, setClients]           = useState<ClientPublic[]>([])
  const [tattoos, setTattoos]           = useState<Tattoo[]>([])
  const [loading, setLoading]           = useState(true)

  // filters
  const [filterDate,   setFilterDate]   = useState('')
  const [filterStatus, setFilterStatus] = useState<AppointmentStatus | ''>('')
  const [filterWorker, setFilterWorker] = useState<number | ''>('')

  // modal state
  const [showForm, setShowForm]         = useState(false)
  const [submitting, setSubmitting]     = useState(false)
  const [apiError, setApiError]         = useState<string | null>(null)

  // step 1 — tattoo + worker + date
  const [selTattoo,  setSelTattoo]  = useState<number | ''>('')
  const [selWorker,  setSelWorker]  = useState<number | ''>('')
  const [selDate,    setSelDate]    = useState(today)

  // step 2 — blocks + slot selection
  const [blocks,       setBlocks]       = useState<AppointmentBlockTime[]>([])
  const [slots,        setSlots]        = useState<{ start: string; end: string }[]>([])
  const [selSlotIdx,   setSelSlotIdx]   = useState<number | ''>('')
  const [blocksLoading, setBlocksLoading] = useState(false)
  const [blocksReady,   setBlocksReady]   = useState(false)

  // step 3 — client
  const [selClient, setSelClient] = useState<number | ''>('')

  useEffect(() => { loadAll() }, [])

  async function loadAll() {
    setLoading(true)
    const [apptRes, workRes, cliRes, tatRes] = await Promise.all([
      appointmentService.getMany(),
      workerService.getAll(),
      clientService.getAll(),
      tattooService.getMany(),
    ])
    if (apptRes.ok) setAppointments(apptRes.data)
    if (workRes.ok) setWorkers(workRes.data)
    if (cliRes.ok)  setClients(cliRes.data)
    if (tatRes.ok)  setTattoos(tatRes.data)
    setLoading(false)
  }

  // ── compute slots whenever tattoo + worker + date are all set ─────────────
  async function fetchSlots() {
    if (!selTattoo || !selWorker || !selDate) return
    const tattoo = tattoos.find(t => t.tattoo_id === Number(selTattoo))
    if (!tattoo) return

    setBlocksLoading(true)
    setBlocksReady(false)
    setSlots([])
    setSelSlotIdx('')

    const res = await appointmentService.getBlocks(Number(selWorker), selDate)
    if (!res.ok) { setBlocksLoading(false); setBlocksReady(true); return }

    const durationMins = timeToMinutes(tattoo.time)
    const allSlots = res.data.flatMap(b => generateSlots(b, durationMins))
    const filteredSlots = filterPastSlots(allSlots, selDate)
    setBlocks(res.data)
    setSlots(filteredSlots)
    setBlocksLoading(false)
    setBlocksReady(true)
  }

  // ── create appointment ────────────────────────────────────────────────────
  const handleCreate = async () => {
    if (!selTattoo || !selWorker || !selClient || selSlotIdx === '') {
      setApiError('Please complete all fields.')
      return
    }
    const slot = slots[Number(selSlotIdx)]
    if (!slot) { setApiError('Invalid slot selected.'); return }

    setSubmitting(true)
    setApiError(null)
    const res = await appointmentService.create({
      worker_id: Number(selWorker),
      client_id: Number(selClient),
      tattoo_id: Number(selTattoo),
      start:     slot.start,
      end:       slot.end,
      date:      selDate as unknown as Date,  // send as "YYYY-MM-DD" string, backend parses it
    })
    setSubmitting(false)
    if (!res.ok) { setApiError(res.error.message); return }
    resetForm()
    loadAll()
  }

  const resetForm = () => {
    setShowForm(false)
    setSelTattoo(''); setSelWorker(''); setSelDate(today)
    setSelClient(''); setSelSlotIdx('')
    setBlocks([]); setSlots([])
    setBlocksReady(false); setApiError(null)
  }

  // ── update status ─────────────────────────────────────────────────────────
  const handleStatusChange = async (id: number, status: AppointmentStatus) => {
    const res = await appointmentService.updateStatus(id, status)
    if (res.ok) setAppointments(prev =>
      prev.map(a => a.appointment_id === id ? { ...a, status } : a)
    )
  }

  // ── label helpers ─────────────────────────────────────────────────────────
  const workerName = (id: number) => {
    const w = workers.find(w => w.worker_id === id)
    return w ? `${w.first_name} ${w.last_name}` : `#${id}`
  }
  const clientName = (id: number) => {
    const c = clients.find(c => c.client_id === id)
    return c ? `${c.first_name} ${c.last_name}` : `#${id}`
  }
  const tattooName = (id: number) => tattoos.find(t => t.tattoo_id === id)?.name ?? `#${id}`

  // ── filtered list ─────────────────────────────────────────────────────────
  const filtered = appointments.filter(a => {
    if (filterStatus && a.status !== filterStatus) return false
    if (filterWorker && a.worker_id !== Number(filterWorker)) return false
    if (filterDate   && !a.date.startsWith(filterDate)) return false
    return true
  })

  const selectedTattoo = tattoos.find(t => t.tattoo_id === Number(selTattoo))
  const step1Ready = selTattoo && selWorker && selDate

  return (
    <div className="h-full flex flex-col">

      {/* ── TOP BAR ── */}
      <div className="shrink-0 px-8 pt-8 pb-6 flex items-center justify-between">
        <div>
          <h1
            className="text-[48px] font-light text-white/95 leading-none"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Appointments
          </h1>
          <p className="text-[11px] uppercase tracking-[0.25em] text-white/40 mt-2">
            {filtered.length} record{filtered.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={loadAll} className="text-white/40 hover:text-white hover:bg-white/5">
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => { setShowForm(true); setApiError(null) }}
            className="h-10 bg-[#ff5a66] hover:bg-[#ff7078] text-black text-[10px] font-bold uppercase tracking-[0.3em] rounded-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Appointment
          </Button>
        </div>
      </div>

      {/* ── FILTERS ── */}
      <div className="shrink-0 px-8 pb-6 flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2 text-white/30">
          <Filter className="w-4 h-4" />
          <span className="text-[10px] uppercase tracking-[0.2em]">Filter</span>
        </div>
        <input
          type="date"
          value={filterDate}
          onChange={e => setFilterDate(e.target.value)}
          className="bg-[#1a1a1a] border border-white/10 text-white/70 text-[12px] px-3 py-2 rounded-sm outline-none focus:border-[#ff5a66] scheme-dark"
        />
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value as AppointmentStatus | '')}
          className="bg-[#1a1a1a] border border-white/10 text-white/70 text-[12px] px-3 py-2 rounded-sm outline-none focus:border-[#ff5a66] cursor-pointer [&>option]:bg-[#1a1a1a]"
        >
          <option value="">All statuses</option>
          {ALL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select
          value={filterWorker}
          onChange={e => setFilterWorker(e.target.value ? Number(e.target.value) : '')}
          className="bg-[#1a1a1a] border border-white/10 text-white/70 text-[12px] px-3 py-2 rounded-sm outline-none focus:border-[#ff5a66] cursor-pointer [&>option]:bg-[#1a1a1a]"
        >
          <option value="">All workers</option>
          {workers.map(w => (
            <option key={w.worker_id} value={w.worker_id}>{w.first_name} {w.last_name}</option>
          ))}
        </select>
        {(filterDate || filterStatus || filterWorker) && (
          <button
            onClick={() => { setFilterDate(''); setFilterStatus(''); setFilterWorker('') }}
            className="text-[10px] uppercase tracking-[0.2em] text-[#ff5a66]/60 hover:text-[#ff5a66] transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* ── TABLE ── */}
      <Scrollable className="flex-1 min-h-0 px-8 pb-8">
        {loading ? (
          <div className="py-24 text-center text-white/30 text-sm">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="py-24 text-center">
            <Calendar className="w-12 h-12 text-white/10 mx-auto mb-4" />
            <p className="text-white/30 text-sm">No appointments found</p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="grid grid-cols-[1fr_1fr_1fr_auto_auto_auto] gap-4 px-4 pb-2 border-b border-white/10">
              {['Client', 'Worker', 'Date', 'Time', 'Status', 'Actions'].map(h => (
                <span key={h} className="text-[9px] uppercase tracking-[0.3em] text-white/30">{h}</span>
              ))}
            </div>
            {filtered.map(apt => (
              <div
                key={apt.appointment_id}
                className="grid grid-cols-[1fr_1fr_1fr_auto_auto_auto] gap-4 items-center px-4 py-4 bg-[#1a1a1a] border border-white/10 rounded-sm hover:border-[#ff5a66]/20 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 bg-white/5 rounded-full flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-white/40" />
                  </div>
                  <span className="text-white/90 text-sm truncate">{clientName(apt.client_id)}</span>
                </div>
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 bg-[#ff5a66]/10 rounded-full flex items-center justify-center shrink-0">
                    <UserCircle className="w-4 h-4 text-[#ff5a66]" />
                  </div>
                  <span className="text-white/70 text-sm truncate">{workerName(apt.worker_id)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-white/30 shrink-0" />
                  <span className="text-white/70 text-sm">
                    {new Date(apt.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <div className="flex items-center gap-2 whitespace-nowrap">
                  <Clock className="w-4 h-4 text-white/30 shrink-0" />
                  <span className="text-white/70 text-sm">{timeRange(apt.start, apt.end)}</span>
                </div>
                <span className={`text-[9px] uppercase tracking-[0.2em] px-3 py-1 rounded-full border whitespace-nowrap ${STATUS_STYLES[apt.status]}`}>
                  {apt.status}
                </span>
                <div className="flex items-center gap-1">
                  {ALL_STATUSES.filter(s => s !== apt.status).map(s => (
                    <Tooltip key={s} content={`Mark as ${s}`} position="top">
                      <button
                        onClick={() => handleStatusChange(apt.appointment_id, s)}
                        className="text-[9px] uppercase tracking-[0.15em] px-2 py-1 text-white/30 hover:text-white/70 hover:bg-white/5 rounded transition-colors"
                      >
                        {s.slice(0, 4)}
                      </button>
                    </Tooltip>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </Scrollable>

      {/* ── MODAL ── */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-sm w-full max-w-xl mx-4 flex flex-col max-h-[90vh]">

            {/* header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-white/10 shrink-0">
              <h2
                className="text-[28px] font-light text-white/95"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                New Appointment
              </h2>
              <button onClick={resetForm} className="text-white/40 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <Scrollable className="flex-1 min-h-0">
              <div className="px-8 py-6 space-y-8">

                {/* ── STEP 1: Tattoo + Worker + Date ── */}
                <div className="space-y-6">
                  <p className="text-[9px] uppercase tracking-[0.3em] text-[#ff5a66]">
                    Step 1 — Select tattoo, worker & date
                  </p>

                  {/* Tattoo */}
                  <div className="relative">
                    <label className={labelCls}>Tattoo Design</label>
                    <div className="relative">
                      <select
                        value={selTattoo}
                        onChange={e => { setSelTattoo(e.target.value ? Number(e.target.value) : ''); setBlocksReady(false); setSlots([]); setSelSlotIdx('') }}
                        className={selectCls}
                      >
                        <option value="">Select tattoo...</option>
                        {tattoos.map(t => (
                          <option key={t.tattoo_id} value={t.tattoo_id}>
                            {t.name} — {t.time}h — ${t.cost}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                    </div>
                    {selectedTattoo && (
                      <p className="mt-2 text-[11px] text-white/40">
                        Duration: <span className="text-white/70">{selectedTattoo.time}</span>
                        &nbsp;·&nbsp;Cost: <span className="text-[#ff5a66]">${selectedTattoo.cost}</span>
                      </p>
                    )}
                  </div>

                  {/* Worker + Date */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="relative">
                      <label className={labelCls}>Worker</label>
                      <div className="relative">
                        <select
                          value={selWorker}
                          onChange={e => { setSelWorker(e.target.value ? Number(e.target.value) : ''); setBlocksReady(false); setSlots([]); setSelSlotIdx('') }}
                          className={selectCls}
                        >
                          <option value="">Select worker...</option>
                          {workers.map(w => (
                            <option key={w.worker_id} value={w.worker_id}>
                              {w.first_name} {w.last_name}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className={labelCls}>Date</label>
                      <input
                        type="date"
                        value={selDate}
                        min={today}
                        onChange={e => { setSelDate(e.target.value); setBlocksReady(false); setSlots([]); setSelSlotIdx('') }}
                        className={`${selectCls} scheme-dark`}
                      />
                    </div>
                  </div>

                  {/* Check availability button */}
                  <Button
                    type="button"
                    onClick={fetchSlots}
                    disabled={!step1Ready || blocksLoading}
                    className="w-full h-10 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#ff5a66]/40 text-white/60 hover:text-white text-[10px] font-bold uppercase tracking-[0.3em] rounded-sm disabled:opacity-40"
                  >
                    {blocksLoading ? 'Checking availability...' : 'Check Available Slots'}
                  </Button>
                </div>

                {/* ── STEP 2: Slot selection ── */}
                {blocksReady && (
                  <div className="space-y-4 border-t border-white/10 pt-6">
                    <p className="text-[9px] uppercase tracking-[0.3em] text-[#ff5a66]">
                      Step 2 — Select time slot
                    </p>

                    {slots.length === 0 ? (
                      <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-sm px-4 py-3">
                        <p className="text-[12px] text-yellow-400">
                          No available slots for this worker on this day.
                          {blocks.length === 0 && ' The worker may not work on this day.'}
                        </p>
                      </div>
                    ) : (
                      <div className="relative">
                        <label className={labelCls}>
                          Available slots ({slots.length})
                        </label>
                        <div className="relative">
                          <select
                            value={selSlotIdx}
                            onChange={e => setSelSlotIdx(e.target.value !== '' ? Number(e.target.value) : '')}
                            className={selectCls}
                          >
                            <option value="">Select a slot...</option>
                            {slots.map((s, i) => (
                              <option key={i} value={i}>
                                {to12h(s.start)} – {to12h(s.end)}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ── STEP 3: Client ── */}
                {blocksReady && slots.length > 0 && selSlotIdx !== '' && (
                  <div className="space-y-4 border-t border-white/10 pt-6">
                    <p className="text-[9px] uppercase tracking-[0.3em] text-[#ff5a66]">
                      Step 3 — Select client
                    </p>
                    <div className="relative">
                      <label className={labelCls}>Client</label>
                      <div className="relative">
                        <select
                          value={selClient}
                          onChange={e => setSelClient(e.target.value ? Number(e.target.value) : '')}
                          className={selectCls}
                        >
                          <option value="">Select client...</option>
                          {clients.map(c => (
                            <option key={c.client_id} value={c.client_id}>
                              {c.first_name} {c.last_name} — {c.email}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Summary ── */}
                {selSlotIdx !== '' && selClient && (
                  <div className="bg-black/40 border border-white/10 rounded-sm px-5 py-4 space-y-2">
                    <p className="text-[9px] uppercase tracking-[0.3em] text-white/30 mb-3">Summary</p>
                    {[
                      ['Tattoo',  selectedTattoo ? `${selectedTattoo.name} (${selectedTattoo.time}h)` : ''],
                      ['Worker',  workerName(Number(selWorker))],
                      ['Client',  clientName(Number(selClient))],
                      ['Date',    new Date(selDate + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })],
                      ['Time',    slots[Number(selSlotIdx)] ? timeRange(slots[Number(selSlotIdx)]!.start, slots[Number(selSlotIdx)]!.end) : ''],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between text-sm">
                        <span className="text-white/40">{k}</span>
                        <span className="text-white/90">{v}</span>
                      </div>
                    ))}
                  </div>
                )}

                {apiError && (
                  <p className="text-[10px] uppercase tracking-wider text-[#ff5a66] border border-[#ff5a66]/20 bg-[#ff5a66]/5 px-4 py-3">
                    {apiError}
                  </p>
                )}

                {/* actions */}
                <div className="flex gap-3 pt-2">
                  <Button
                    onClick={handleCreate}
                    disabled={submitting || !selClient || selSlotIdx === ''}
                    className="flex-1 h-12 bg-[#ff5a66] hover:bg-[#ff7078] text-black text-[10px] font-bold uppercase tracking-[0.3em] rounded-sm disabled:opacity-40"
                  >
                    {submitting ? 'Creating...' : 'Confirm Appointment'}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={resetForm}
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
