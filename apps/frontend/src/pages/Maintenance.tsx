/**
 * Maintenance.tsx — Tattoo Catalog Management
 * Admin panel page to create, view and manage tattoo options.
 */

import { useState, useEffect } from 'react'
import { Icon } from '@iconify/react'
import { tattooService, type Tattoo, type CreateTattooRequest } from '@/lib/tattoo.service'

const fmtCost = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)

const emptyForm = (): CreateTattooRequest => ({
  name: '', cost: 0, time: '01:00',
  img: { source: '', description: '' },
  materials: [],
})

function StatCard({ icon, label, value, accent }: { icon: string; label: string; value: string | number; accent?: boolean }) {
  return (
    <div className={`bg-[#1a1a1a] border rounded-sm p-5 flex items-center gap-4 ${accent ? 'border-[#ff5a66]/20' : 'border-white/8'}`}>
      <div className={`w-10 h-10 rounded-sm flex items-center justify-center ${accent ? 'bg-[#ff5a66]/10' : 'bg-white/5'}`}>
        <Icon icon={icon} className={`w-5 h-5 ${accent ? 'text-[#ff5a66]' : 'text-white/40'}`} />
      </div>
      <div>
        <p className="text-[9px] uppercase tracking-[0.25em] text-white/25 mb-1">{label}</p>
        <p className="text-[22px] font-light text-white/90" style={{ fontFamily: 'Cormorant Garamond, serif' }}>{value}</p>
      </div>
    </div>
  )
}

export default function Maintenance() {
  const [tattoos,  setTattoos]  = useState<Tattoo[]>([])
  const [loading,  setLoading]  = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form,     setForm]     = useState<CreateTattooRequest>(emptyForm())
  const [saving,   setSaving]   = useState(false)
  const [error,    setError]    = useState<string | null>(null)
  const [success,  setSuccess]  = useState(false)
  const [search,   setSearch]   = useState('')
  const [sortBy,   setSortBy]   = useState<'name' | 'cost' | 'time'>('name')

  const load = async () => {
    setLoading(true)
    const res = await tattooService.getMany()
    if (res.ok) setTattoos(res.data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const filtered = tattoos
    .filter(t => t.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'cost') return a.cost - b.cost
      if (sortBy === 'time') return a.time.localeCompare(b.time)
      return a.name.localeCompare(b.name)
    })

  const setField = (f: keyof Omit<CreateTattooRequest, 'img' | 'materials'>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = f === 'cost' ? Number(e.target.value) : e.target.value
      setForm(p => ({ ...p, [f]: val }))
    }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) { setError('Name is required.'); return }
    if (form.cost <= 0)    { setError('Cost must be greater than 0.'); return }
    setSaving(true); setError(null)
    const res = await tattooService.create(form)
    setSaving(false)
    if (!res.ok) { setError((res as any).error?.message ?? 'Failed to create tattoo.'); return }
    setSuccess(true); setShowForm(false); setForm(emptyForm()); load()
    setTimeout(() => setSuccess(false), 4000)
  }

  const labelCls = 'block text-[9px] font-semibold uppercase tracking-[0.3em] text-white/30 mb-2'
  const inputCls = 'w-full bg-[#0a0a0a] border border-white/10 text-white/80 text-[13px] px-3 py-2.5 rounded-sm outline-none focus:border-[#ff5a66] transition-colors placeholder:text-white/20'

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">

      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-[48px] font-light text-white/95 leading-none"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Maintenance
          </h1>
          <p className="text-[11px] uppercase tracking-[0.25em] text-white/35 mt-2">
            Tattoo Catalog · Manage designs & pricing
          </p>
        </div>
        <button
          onClick={() => { setShowForm(p => !p); setError(null) }}
          className={`flex items-center gap-2 h-10 px-5 rounded-sm text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${
            showForm ? 'bg-white/8 border border-white/15 text-white/50' : 'bg-[#ff5a66] hover:bg-[#ff7078] text-black'
          }`}
        >
          <Icon icon={showForm ? 'mdi:close' : 'mdi:plus'} className="w-4 h-4" />
          {showForm ? 'Cancel' : 'Add Tattoo'}
        </button>
      </div>

      {/* Success banner */}
      {success && (
        <div className="flex items-center gap-3 px-4 py-3 bg-emerald-500/8 border border-emerald-500/20 rounded-sm text-emerald-400 text-[12px]">
          <Icon icon="mdi:check-circle-outline" className="w-4 h-4 shrink-0" />
          Tattoo created successfully and added to the catalog.
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon="mdi:palette-outline" label="Total Designs" value={tattoos.length} accent />
        <StatCard icon="mdi:currency-usd" label="Avg. Cost"
          value={tattoos.length ? fmtCost(Math.round(tattoos.reduce((a, t) => a + t.cost, 0) / tattoos.length)) : '$0'} />
        <StatCard icon="mdi:clock-outline" label="Shortest Session"
          value={tattoos.length ? tattoos.reduce((a, t) => a.time < t.time ? a : t, tattoos[0])?.time ?? '—' : '—'} />
        <StatCard icon="mdi:tag-outline" label="Price Range"
          value={tattoos.length
            ? `${fmtCost(Math.min(...tattoos.map(t => t.cost)))}–${fmtCost(Math.max(...tattoos.map(t => t.cost)))}`
            : '—'} />
      </div>

      {/* Create form */}
      {showForm && (
        <div className="bg-[#1a1a1a] border border-white/10 rounded-sm p-6 md:p-8">
          <div className="flex items-center gap-3 mb-7">
            <div className="w-8 h-8 bg-[#ff5a66]/10 rounded-sm flex items-center justify-center">
              <Icon icon="mdi:needle" className="w-4 h-4 text-[#ff5a66]" />
            </div>
            <div>
              <p className="text-[13px] text-white/80 font-medium">New Tattoo Design</p>
              <p className="text-[10px] text-white/30">Fill in the details to add a design to the catalog</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className={labelCls}>Design Name *</label>
                <input value={form.name} onChange={setField('name')}
                  className={inputCls} placeholder="e.g. Dragon Sleeve" required />
              </div>
              <div>
                <label className={labelCls}>Base Price (USD) *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-[13px]">$</span>
                  <input type="number" min={1} value={form.cost || ''} onChange={setField('cost')}
                    className={inputCls + ' pl-7'} placeholder="150" required />
                </div>
              </div>
              <div>
                <label className={labelCls}>Duration (HH:MM) *</label>
                <input type="time" value={form.time} onChange={setField('time')}
                  className={inputCls + ' [color-scheme:dark]'} required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelCls}>Reference Image URL</label>
                <input
                  value={form.img.source as string}
                  onChange={e => setForm(p => ({ ...p, img: { ...p.img, source: e.target.value } }))}
                  className={inputCls} placeholder="https://example.com/image.jpg  (optional)" />
              </div>
              <div>
                <label className={labelCls}>Description</label>
                <input
                  value={form.img.description ?? ''}
                  onChange={e => setForm(p => ({ ...p, img: { ...p.img, description: e.target.value } }))}
                  className={inputCls} placeholder="Short description of the design (optional)" />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-[11px] text-red-400/80 bg-red-500/5 border border-red-500/15 rounded-sm px-4 py-3">
                <Icon icon="mdi:alert-circle-outline" className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button type="submit" disabled={saving}
                className="h-11 px-8 bg-[#ff5a66] hover:bg-[#ff7078] text-black text-[10px] font-bold uppercase tracking-[0.3em] rounded-sm disabled:opacity-50 transition-all flex items-center gap-2">
                {saving
                  ? <><span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-black/30 border-t-black" /> Saving…</>
                  : <><Icon icon="mdi:content-save-outline" className="w-4 h-4" /> Save Design</>
                }
              </button>
              <button type="button" onClick={() => { setShowForm(false); setForm(emptyForm()); setError(null) }}
                className="h-11 px-5 border border-white/10 text-[10px] uppercase tracking-[0.2em] text-white/35 hover:text-white/60 rounded-sm transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Catalog table */}
      <div className="bg-[#1a1a1a] border border-white/10 rounded-sm overflow-hidden">

        {/* Toolbar */}
        <div className="px-5 py-4 border-b border-white/8 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <p className="text-[9px] uppercase tracking-[0.3em] text-white/25">
            {loading ? 'Loading…' : `${filtered.length} of ${tattoos.length} designs`}
          </p>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-52">
              <Icon icon="mdi:magnify" className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25 pointer-events-none" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search designs…"
                className="w-full bg-[#0a0a0a] border border-white/8 text-white/70 text-[12px] pl-8 pr-3 py-2 rounded-sm outline-none focus:border-[#ff5a66] transition-colors placeholder:text-white/20" />
            </div>
            <select value={sortBy} onChange={e => setSortBy(e.target.value as any)}
              className="bg-[#0a0a0a] border border-white/8 text-white/50 text-[11px] px-3 py-2 rounded-sm outline-none focus:border-[#ff5a66] cursor-pointer [&>option]:bg-[#1a1a1a]">
              <option value="name">Sort: Name</option>
              <option value="cost">Sort: Price</option>
              <option value="time">Sort: Duration</option>
            </select>
            <button onClick={load} disabled={loading}
              className="h-9 w-9 flex items-center justify-center border border-white/8 text-white/30 hover:text-white/60 rounded-sm transition-colors disabled:opacity-40">
              <Icon icon="mdi:refresh" className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Table head */}
        <div className="grid grid-cols-[1fr_110px_110px_70px] gap-4 px-5 py-3 border-b border-white/6 bg-black/20">
          {['Design', 'Price', 'Duration', 'ID'].map(h => (
            <span key={h} className="text-[9px] uppercase tracking-[0.3em] text-white/20">{h}</span>
          ))}
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center gap-3 text-white/25">
            <span className="h-6 w-6 animate-spin rounded-full border-2 border-white/10 border-t-[#ff5a66]" />
            <span className="text-[10px] uppercase tracking-[0.3em]">Loading catalog…</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center">
            <Icon icon="mdi:palette-off-outline" className="w-10 h-10 text-white/10 mx-auto mb-3" />
            <p className="text-[11px] uppercase tracking-[0.3em] text-white/20">
              {search ? 'No designs match your search' : 'No designs yet'}
            </p>
            {!search && (
              <button onClick={() => setShowForm(true)}
                className="mt-4 text-[10px] uppercase tracking-[0.2em] text-[#ff5a66]/60 hover:text-[#ff5a66] transition-colors">
                Add your first design →
              </button>
            )}
          </div>
        ) : (
          <div>
            {filtered.map((t, i) => (
              <div key={t.tattoo_id}
                className={`grid grid-cols-[1fr_110px_110px_70px] gap-4 px-5 py-4 items-center hover:bg-white/[0.02] transition-colors ${
                  i < filtered.length - 1 ? 'border-b border-white/[0.04]' : ''
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 bg-[#ff5a66]/8 border border-[#ff5a66]/15 rounded-sm flex items-center justify-center shrink-0">
                    <Icon icon="mdi:needle" className="w-3.5 h-3.5 text-[#ff5a66]/70" />
                  </div>
                  <p className="text-[13px] text-white/80 truncate">{t.name}</p>
                </div>
                <span className="text-[13px] text-emerald-400/80 font-mono">{fmtCost(t.cost)}</span>
                <div className="flex items-center gap-1.5 text-[12px] text-white/45">
                  <Icon icon="mdi:clock-outline" className="w-3.5 h-3.5 text-white/25" />
                  {t.time}
                </div>
                <span className="text-[10px] text-white/20 font-mono">#{t.tattoo_id}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info note */}
      <div className="flex items-start gap-3 px-4 py-3 bg-white/[0.02] border border-white/6 rounded-sm">
        <Icon icon="mdi:information-outline" className="w-4 h-4 text-white/25 shrink-0 mt-0.5" />
        <p className="text-[11px] text-white/30 leading-relaxed">
          Designs added here become available for clients to select when booking a session.
          Pricing shown is the base rate; final cost may vary depending on size, complexity and artist.
        </p>
      </div>
    </div>
  )
}
