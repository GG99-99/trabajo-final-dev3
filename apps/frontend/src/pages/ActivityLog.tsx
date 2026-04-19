import { useState, useEffect, useCallback } from 'react'
import Scrollable from '@/componentes/Scrollable'
import Icon from '@/componentes/Icon'
import { auditService } from '@/lib/audit.service'
import type { AuditLog, AuditLogFilters } from '@final/shared'

// ── Styling maps ──────────────────────────────────────────────────────────
const ACTION_STYLE: Record<string, string> = {
  LOGIN:         'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  REGISTER:      'bg-blue-500/10 text-blue-400 border-blue-500/20',
  CREATE:        'bg-[#ff5a66]/10 text-[#ff5a66] border-[#ff5a66]/20',
  UPDATE:        'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  DELETE:        'bg-red-900/20 text-red-400 border-red-500/20',
  BAN:           'bg-orange-500/10 text-orange-400 border-orange-500/20',
  RESTORE:       'bg-teal-500/10 text-teal-400 border-teal-500/20',
  PAYMENT:       'bg-purple-500/10 text-purple-400 border-purple-500/20',
  REFUND:        'bg-pink-500/10 text-pink-400 border-pink-500/20',
  TOKEN_REFRESH: 'bg-white/5 text-white/40 border-white/10',
}

const ACTION_ICON: Record<string, string> = {
  LOGIN:         'lucide:log-in',
  REGISTER:      'lucide:user-plus',
  CREATE:        'lucide:plus-circle',
  UPDATE:        'lucide:pencil',
  DELETE:        'lucide:trash-2',
  BAN:           'lucide:ban',
  RESTORE:       'lucide:rotate-ccw',
  PAYMENT:       'lucide:credit-card',
  REFUND:        'lucide:corner-up-left',
  TOKEN_REFRESH: 'lucide:key',
}

const ALL_ACTIONS  = ['LOGIN','REGISTER','CREATE','UPDATE','DELETE','BAN','RESTORE','PAYMENT','REFUND','TOKEN_REFRESH']
const ALL_ENTITIES = ['auth','appointment','bill','payment','person','worker','cashier','client','product','inventory','stock_movement','tattoo','schedule','seat','provider','category','attendance','assist']

// ── Helpers ───────────────────────────────────────────────────────────────
const labelCls = 'block text-[9px] font-semibold uppercase tracking-[0.3em] text-white/30 mb-1.5'
const inputCls = 'w-full bg-[#0a0a0a] border border-white/10 text-white/70 text-[12px] px-3 py-2 rounded-sm outline-none focus:border-[#ff5a66] transition-colors placeholder:text-white/20 [color-scheme:dark]'

function fmtDate(iso: string) {
  const d = new Date(iso)
  return {
    date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    time: d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
  }
}

// ── Row ───────────────────────────────────────────────────────────────────
function LogRow({ log }: { log: AuditLog }) {
  const [open, setOpen] = useState(false)
  const { date, time } = fmtDate(log.created_at)
  const hasMetadata = log.metadata && Object.keys(log.metadata).length > 0

  return (
    <>
      <div
        onClick={() => hasMetadata && setOpen(o => !o)}
        className={`grid grid-cols-[1fr_100px_120px_80px_180px_24px] gap-4 px-5 py-3.5 items-center
          hover:bg-white/[0.025] transition-colors border-b border-white/[0.04] last:border-0
          ${hasMetadata ? 'cursor-pointer' : ''}`}
      >
        {/* Description */}
        <div className="min-w-0">
          <p className="text-[12px] text-white/65 truncate font-mono">
            {log.description ?? '—'}
          </p>
          {log.entity_id && (
            <p className="text-[10px] text-white/25 mt-0.5">id: {log.entity_id}</p>
          )}
        </div>

        {/* Entity */}
        <span className="text-[10px] uppercase tracking-[0.12em] text-white/35 truncate">
          {log.entity}
        </span>

        {/* Action badge */}
        <span className={`inline-flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] px-2.5 py-1 rounded-full border w-fit whitespace-nowrap ${ACTION_STYLE[log.action] ?? 'bg-white/5 text-white/30 border-white/10'}`}>
          <Icon name={ACTION_ICON[log.action] ?? 'lucide:activity'} size={9} />
          {log.action}
        </span>

        {/* User */}
        <div className="text-center">
          {log.person_id
            ? <span className="text-[11px] text-white/50 font-mono">#{log.person_id}</span>
            : <span className="text-[10px] text-white/20 italic">system</span>
          }
        </div>

        {/* Date */}
        <div>
          <p className="text-[11px] text-white/50 font-mono">{date}</p>
          <p className="text-[10px] text-white/30 font-mono mt-0.5">{time}</p>
        </div>

        {/* Expand icon */}
        <div className="flex items-center justify-center">
          {hasMetadata && (
            <Icon
              name={open ? 'lucide:chevron-up' : 'lucide:chevron-down'}
              size={13}
              className="text-white/25"
            />
          )}
        </div>
      </div>

      {/* Expanded metadata */}
      {open && hasMetadata && (
        <div className="px-5 pb-4 pt-2 bg-black/30 border-b border-white/[0.04]">
          <p className="text-[9px] uppercase tracking-[0.3em] text-white/20 mb-2">Payload</p>
          <pre className="text-[11px] text-emerald-400/70 font-mono overflow-x-auto whitespace-pre-wrap break-all bg-black/40 border border-white/8 rounded-sm p-3 max-h-48">
            {JSON.stringify(log.metadata, null, 2)}
          </pre>
          {log.ip && (
            <p className="mt-2 text-[10px] text-white/25 font-mono">
              IP: {log.ip}
            </p>
          )}
        </div>
      )}
    </>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────
export default function ActivityLog() {
  const [logs,    setLogs]    = useState<AuditLog[]>([])
  const [total,   setTotal]   = useState(0)
  const [pages,   setPages]   = useState(1)
  const [loading, setLoading] = useState(false)

  const [filters, setFilters] = useState<AuditLogFilters>({
    page: 1, limit: 40, sort: 'desc',
  })

  const load = useCallback(async (f: AuditLogFilters) => {
    setLoading(true)
    const res = await auditService.getMany(f)
    if (res.ok) {
      setLogs(res.data.data)
      setTotal(res.data.total)
      setPages(res.data.pages)
    }
    setLoading(false)
  }, [])

  useEffect(() => { load(filters) }, [filters, load])

  const set = (patch: Partial<AuditLogFilters>) =>
    setFilters(prev => ({ ...prev, ...patch, page: 1 }))

  const clearFilters = () =>
    setFilters({ page: 1, limit: 40, sort: 'desc' })

  const currentPage = filters.page ?? 1

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">

      {/* ── Header ── */}
      <div className="flex items-end justify-between">
        <div>
          <h1
            className="text-[48px] font-light text-white/95 leading-none"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Activity Log
          </h1>
          <p className="text-[11px] uppercase tracking-[0.25em] text-white/40 mt-2">
            {loading ? 'Loading…' : `${total.toLocaleString()} records`}
          </p>
        </div>

        {/* Live refresh */}
        <button
          onClick={() => load(filters)}
          disabled={loading}
          className="flex items-center gap-2 h-9 px-4 border border-white/10 text-[9px] uppercase tracking-[0.25em] text-white/35 hover:border-white/20 hover:text-white/60 rounded-sm transition-all disabled:opacity-40"
        >
          <Icon name="lucide:refresh-cw" size={11} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* ── Filters ── */}
      <div className="bg-[#1a1a1a] border border-white/10 rounded-sm p-5">
        <p className="text-[9px] uppercase tracking-[0.35em] text-white/20 mb-4">Filter & Sort</p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div>
            <label className={labelCls}>From date</label>
            <input
              type="date"
              className={inputCls}
              value={filters.date_from ?? ''}
              onChange={e => set({ date_from: e.target.value || undefined })}
            />
          </div>

          <div>
            <label className={labelCls}>To date</label>
            <input
              type="date"
              className={inputCls}
              value={filters.date_to ?? ''}
              onChange={e => set({ date_to: e.target.value || undefined })}
            />
          </div>

          <div>
            <label className={labelCls}>Action</label>
            <select
              className={inputCls + ' cursor-pointer'}
              value={filters.action ?? ''}
              onChange={e => set({ action: e.target.value || undefined })}
            >
              <option value="">All actions</option>
              {ALL_ACTIONS.map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelCls}>Entity</label>
            <select
              className={inputCls + ' cursor-pointer'}
              value={filters.entity ?? ''}
              onChange={e => set({ entity: e.target.value || undefined })}
            >
              <option value="">All entities</option>
              {ALL_ENTITIES.map(e => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelCls}>Sort by date</label>
            <select
              className={inputCls + ' cursor-pointer'}
              value={filters.sort ?? 'desc'}
              onChange={e => set({ sort: e.target.value as 'asc' | 'desc' })}
            >
              <option value="desc">Newest first</option>
              <option value="asc">Oldest first</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="w-full h-[34px] border border-white/10 text-[9px] uppercase tracking-[0.25em] text-white/30 hover:text-white/60 hover:border-white/20 rounded-sm transition-all"
            >
              Clear all
            </button>
          </div>
        </div>

        {/* Active filter chips */}
        {(filters.action || filters.entity || filters.date_from || filters.date_to) && (
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/8">
            {filters.action && (
              <span className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-[0.15em] px-2.5 py-1 bg-[#ff5a66]/10 text-[#ff5a66] border border-[#ff5a66]/20 rounded-full">
                Action: {filters.action}
                <button onClick={() => set({ action: undefined })} className="hover:text-white">
                  <Icon name="lucide:x" size={9} />
                </button>
              </span>
            )}
            {filters.entity && (
              <span className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-[0.15em] px-2.5 py-1 bg-white/5 text-white/50 border border-white/10 rounded-full">
                Entity: {filters.entity}
                <button onClick={() => set({ entity: undefined })} className="hover:text-white">
                  <Icon name="lucide:x" size={9} />
                </button>
              </span>
            )}
            {filters.date_from && (
              <span className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-[0.15em] px-2.5 py-1 bg-white/5 text-white/50 border border-white/10 rounded-full">
                From: {filters.date_from}
                <button onClick={() => set({ date_from: undefined })} className="hover:text-white">
                  <Icon name="lucide:x" size={9} />
                </button>
              </span>
            )}
            {filters.date_to && (
              <span className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-[0.15em] px-2.5 py-1 bg-white/5 text-white/50 border border-white/10 rounded-full">
                To: {filters.date_to}
                <button onClick={() => set({ date_to: undefined })} className="hover:text-white">
                  <Icon name="lucide:x" size={9} />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* ── Table ── */}
      <div className="bg-[#1a1a1a] border border-white/10 rounded-sm overflow-hidden">

        {/* Table head */}
        <div className="grid grid-cols-[1fr_100px_120px_80px_180px_24px] gap-4 px-5 py-3 border-b border-white/8 bg-black/20">
          {['Description / ID', 'Entity', 'Action', 'User', 'Date & Time', ''].map((h, i) => (
            <span key={i} className="text-[9px] uppercase tracking-[0.3em] text-white/20">{h}</span>
          ))}
        </div>

        {loading ? (
          <div className="py-24 flex flex-col items-center gap-3 text-white/25">
            <span className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-white/10 border-t-[#ff5a66]" />
            <span className="text-[10px] uppercase tracking-[0.3em]">Loading…</span>
          </div>
        ) : logs.length === 0 ? (
          <div className="py-24 text-center">
            <Icon name="lucide:activity" size={32} className="text-white/10 mx-auto mb-3" />
            <p className="text-[11px] uppercase tracking-[0.3em] text-white/25">No activity found</p>
          </div>
        ) : (
          <div>
            {logs.map(log => <LogRow key={log.audit_id} log={log} />)}
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-white/8 bg-black/10">
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-white/30 uppercase tracking-[0.2em]">
                Page {currentPage} of {pages}
              </span>
              <span className="text-[10px] text-white/20">·</span>
              <span className="text-[10px] text-white/20 uppercase tracking-[0.15em]">
                {total.toLocaleString()} total
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={currentPage <= 1}
                onClick={() => setFilters(p => ({ ...p, page: (p.page ?? 1) - 1 }))}
                className="h-8 w-8 flex items-center justify-center border border-white/10 text-white/40 hover:border-white/20 hover:text-white/70 rounded-sm transition-all disabled:opacity-25 disabled:cursor-not-allowed"
              >
                <Icon name="lucide:chevron-left" size={13} />
              </button>

              {/* Page number pills */}
              {Array.from({ length: Math.min(pages, 7) }, (_, i) => {
                const p = currentPage <= 4
                  ? i + 1
                  : currentPage >= pages - 3
                    ? pages - 6 + i
                    : currentPage - 3 + i
                if (p < 1 || p > pages) return null
                return (
                  <button
                    key={p}
                    onClick={() => setFilters(prev => ({ ...prev, page: p }))}
                    className={`h-8 w-8 flex items-center justify-center text-[10px] font-mono rounded-sm transition-all ${
                      p === currentPage
                        ? 'bg-[#ff5a66] text-black font-bold'
                        : 'border border-white/10 text-white/35 hover:border-white/20 hover:text-white/60'
                    }`}
                  >
                    {p}
                  </button>
                )
              })}

              <button
                disabled={currentPage >= pages}
                onClick={() => setFilters(p => ({ ...p, page: (p.page ?? 1) + 1 }))}
                className="h-8 w-8 flex items-center justify-center border border-white/10 text-white/40 hover:border-white/20 hover:text-white/70 rounded-sm transition-all disabled:opacity-25 disabled:cursor-not-allowed"
              >
                <Icon name="lucide:chevron-right" size={13} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
