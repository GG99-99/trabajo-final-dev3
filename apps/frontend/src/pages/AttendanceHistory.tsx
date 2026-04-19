import { useState, useEffect } from 'react'
import Scrollable from '@/componentes/Scrollable'
import { Button } from '@/componentes/ui/button'
import { Clock, RefreshCw, Filter, AlertTriangle, CheckCircle, XCircle, User } from 'lucide-react'
import { punchService, fingerprintService, type PunchRecord } from '@/lib/punch.service'
import { workerService } from '@/lib/people.service'
import type { WorkerPublic } from '@final/shared'

const pad = (n: number) => String(n).padStart(2, '0')
const fmtTime = (iso: string) => {
  const d = new Date(iso)
  const h = d.getHours(), m = d.getMinutes()
  const period = h >= 12 ? 'PM' : 'AM'
  return `${h % 12 || 12}:${pad(m)} ${period}`
}
const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })

const diffHours = (start: string, close: string | null) => {
  if (!close) return null
  const ms = new Date(close).getTime() - new Date(start).getTime()
  const h = Math.floor(ms / 3600000)
  const m = Math.floor((ms % 3600000) / 60000)
  return `${h}h ${pad(m)}m`
}

export default function AttendanceHistory() {
  const [records, setRecords]   = useState<PunchRecord[]>([])
  const [workers, setWorkers]   = useState<WorkerPublic[]>([])
  const [missing, setMissing]   = useState<{ worker_id: number; person: { first_name: string; last_name: string } }[]>([])
  const [loading, setLoading]   = useState(true)
  const [filterWorker, setFilterWorker] = useState<number | ''>('')
  const [filterDate,   setFilterDate]   = useState('')

  useEffect(() => { loadAll() }, [])

  async function loadAll() {
    setLoading(true)
    const [histRes, workRes, missRes] = await Promise.all([
      punchService.getHistory(),
      workerService.getAll(),
      fingerprintService.getMissing(),
    ])
    if (histRes.ok) setRecords(histRes.data)
    if (workRes.ok) setWorkers(workRes.data)
    if (missRes.ok) setMissing(missRes.data)
    setLoading(false)
  }

  async function applyFilters() {
    setLoading(true)
    const res = await punchService.getHistory({
      worker_id: filterWorker ? Number(filterWorker) : undefined,
      date:      filterDate   || undefined,
    })
    if (res.ok) setRecords(res.data)
    setLoading(false)
  }

  return (
    <div className="h-full flex flex-col">

      {/* TOP BAR */}
      <div className="shrink-0 px-8 pt-8 pb-6 flex items-center justify-between">
        <div>
          <h1 className="text-[48px] font-light text-white/95 leading-none"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Attendance
          </h1>
          <p className="text-[11px] uppercase tracking-[0.25em] text-white/40 mt-2">
            {records.length} record{records.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button variant="ghost" onClick={loadAll} className="text-white/40 hover:text-white hover:bg-white/5">
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      {/* Missing fingerprint warning */}
      {missing.length > 0 && (
        <div className="shrink-0 mx-8 mb-4 bg-yellow-500/8 border border-yellow-500/25 rounded-sm px-5 py-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-[12px] text-yellow-300/80 font-medium">
              {missing.length} worker{missing.length !== 1 ? 's' : ''} without registered fingerprint
            </p>
            <p className="text-[11px] text-yellow-400/50 mt-1">
              {missing.map(w => `${w.person.first_name} ${w.person.last_name}`).join(', ')}
            </p>
          </div>
        </div>
      )}

      {/* FILTERS */}
      <div className="shrink-0 px-8 pb-6 flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2 text-white/30">
          <Filter className="w-4 h-4" />
          <span className="text-[10px] uppercase tracking-[0.2em]">Filter</span>
        </div>
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
        <input
          type="date"
          value={filterDate}
          onChange={e => setFilterDate(e.target.value)}
          className="bg-[#1a1a1a] border border-white/10 text-white/70 text-[12px] px-3 py-2 rounded-sm outline-none focus:border-[#ff5a66] scheme-dark"
        />
        <Button
          onClick={applyFilters}
          className="h-9 bg-[#ff5a66] hover:bg-[#ff7078] text-black text-[10px] font-bold uppercase tracking-[0.25em] rounded-sm"
        >
          Apply
        </Button>
        {(filterWorker || filterDate) && (
          <button
            onClick={() => { setFilterWorker(''); setFilterDate(''); loadAll() }}
            className="text-[10px] uppercase tracking-[0.2em] text-[#ff5a66]/60 hover:text-[#ff5a66] transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* TABLE */}
      <Scrollable className="flex-1 min-h-0 px-8 pb-8">
        {loading ? (
          <div className="py-24 text-center text-white/30 text-sm">Loading...</div>
        ) : records.length === 0 ? (
          <div className="py-24 text-center">
            <Clock className="w-12 h-12 text-white/10 mx-auto mb-4" />
            <p className="text-white/30 text-sm">No attendance records found</p>
          </div>
        ) : (
          <div className="space-y-2">
            {/* header */}
            <div className="grid grid-cols-[minmax(160px,1fr)_140px_120px_120px_100px_80px] gap-4 px-4 pb-2 border-b border-white/10">
              {['Worker', 'Date', 'Clock In', 'Clock Out', 'Duration', 'Status'].map(h => (
                <span key={h} className="text-[9px] uppercase tracking-[0.3em] text-white/30">{h}</span>
              ))}
            </div>
            {records.map((r, i) => {
              const duration = diffHours(r.start, r.close)
              const complete = !!r.close
              return (
                <div
                  key={i}
                  className="grid grid-cols-[minmax(160px,1fr)_140px_120px_120px_100px_80px] gap-4 items-center px-4 py-4 bg-[#1a1a1a] border border-white/10 rounded-sm hover:border-[#ff5a66]/20 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 bg-[#ff5a66]/10 rounded-full flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 text-[#ff5a66]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-white/90 text-sm truncate">
                        {r.worker.person.first_name} {r.worker.person.last_name}
                      </p>
                    </div>
                  </div>
                  <span className="text-white/60 text-sm">{fmtDate(r.attendance.work_date)}</span>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="text-white/80 text-sm">{fmtTime(r.start)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {r.close ? (
                      <><XCircle className="w-3.5 h-3.5 text-[#ff5a66] shrink-0" />
                      <span className="text-white/80 text-sm">{fmtTime(r.close)}</span></>
                    ) : (
                      <span className="text-white/25 text-sm italic">Pending</span>
                    )}
                  </div>
                  <span className="text-white/60 text-sm">{duration ?? '—'}</span>
                  <span className={`text-[9px] uppercase tracking-[0.2em] px-2 py-1 rounded-full border whitespace-nowrap ${
                    complete
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                  }`}>
                    {complete ? 'Done' : 'Active'}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </Scrollable>
    </div>
  )
}
