import { useState, useEffect, useRef } from 'react'
import Scrollable from '@/componentes/Scrollable'
import { Button } from '@/componentes/ui/button'
import { Plus, X, RefreshCw, Upload, ImageIcon, Clock, DollarSign, Pencil, Check } from 'lucide-react'
import { tattooService, type Tattoo } from '@/lib/tattoo.service'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3030/api'

const inputCls = "w-full bg-[#0a0a0a] border border-white/10 text-white/80 text-[13px] px-3 py-2.5 rounded-sm outline-none focus:border-[#ff5a66] transition-colors placeholder:text-white/20"
const labelCls = "block text-[9px] font-semibold uppercase tracking-[0.3em] text-white/30 mb-2"

// ── Edit modal ─────────────────────────────────────────────────────────────
function EditModal({
  tattoo, onClose, onSaved
}: {
  tattoo: Tattoo
  onClose: () => void
  onSaved: (updated: Tattoo) => void
}) {
  const [name,        setName]        = useState(tattoo.name)
  const [cost,        setCost]        = useState(String(tattoo.cost))
  const [time,        setTime]        = useState(tattoo.time)
  const [description, setDescription] = useState('')
  const [imageFile,   setImageFile]   = useState<File | null>(null)
  const [preview,     setPreview]     = useState<string | null>(null)
  const [saving,      setSaving]      = useState(false)
  const [error,       setError]       = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    setImageFile(f)
    setPreview(URL.createObjectURL(f))
  }

  async function handleSave() {
    if (!name || !cost || !time) { setError('Name, cost and time are required.'); return }
    setSaving(true); setError(null)
    const res = await tattooService.update(tattoo.tattoo_id, {
      name, cost: parseFloat(cost), time, description: description || undefined,
      imageFile: imageFile ?? undefined,
    })
    setSaving(false)
    if (!res.ok) { setError(res.error?.message ?? 'Update failed'); return }
    onSaved(res.data)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-[#1a1a1a] border border-white/10 rounded-sm w-full max-w-lg mx-4 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-8 py-6 border-b border-white/10 shrink-0">
          <h2 className="text-[28px] font-light text-white/95" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Edit Design
          </h2>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <Scrollable className="flex-1 min-h-0">
          <div className="px-8 py-6 space-y-6">

            {/* Current image + replace */}
            <div>
              <label className={labelCls}>Image</label>
              <div
                onClick={() => fileRef.current?.click()}
                className="relative aspect-video min-h-[200px] rounded-sm border-2 border-dashed border-white/10 hover:border-white/20 cursor-pointer overflow-hidden transition-colors"
              >
                {preview ? (
                  <img src={preview} alt="new" className="w-full h-full object-cover" />
                ) : (
                  <img
                    src={tattooService.imageUrl(tattoo)}
                    alt={tattoo.name}
                    className="w-full h-full object-cover opacity-60"
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                  />
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity">
                  <div className="flex flex-col items-center gap-1">
                    <Upload className="w-6 h-6 text-white" />
                    <span className="text-[10px] text-white uppercase tracking-[0.2em]">Replace image</span>
                  </div>
                </div>
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
              {preview && (
                <button onClick={() => { setPreview(null); setImageFile(null); if (fileRef.current) fileRef.current.value = '' }}
                  className="mt-1.5 text-[10px] uppercase tracking-[0.2em] text-[#ff5a66]/60 hover:text-[#ff5a66] transition-colors">
                  Remove new image
                </button>
              )}
            </div>

            <div>
              <label className={labelCls}>Name</label>
              <input value={name} onChange={e => setName(e.target.value)} className={inputCls} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Cost (USD)</label>
                <input value={cost} onChange={e => setCost(e.target.value)} type="number" min="0" step="0.01" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Duration (HH:MM)</label>
                <input value={time} onChange={e => setTime(e.target.value)} className={inputCls} placeholder="02:30" />
              </div>
            </div>

            <div>
              <label className={labelCls}>Image Description <span className="text-white/20 normal-case tracking-normal font-normal">optional</span></label>
              <input value={description} onChange={e => setDescription(e.target.value)} className={inputCls} placeholder="Update image description..." />
            </div>

            {error && (
              <p className="text-[10px] uppercase tracking-wider text-[#ff5a66] border border-[#ff5a66]/20 bg-[#ff5a66]/5 px-4 py-3">
                {error}
              </p>
            )}

            <div className="flex gap-3 pt-2">
              <Button onClick={handleSave} disabled={saving}
                className="flex-1 h-12 bg-[#ff5a66] hover:bg-[#ff7078] text-black text-[10px] font-bold uppercase tracking-[0.3em] rounded-sm disabled:opacity-40">
                <Check className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button variant="ghost" onClick={onClose}
                className="h-12 px-6 border border-white/10 text-white/40 hover:text-white hover:border-white/20 text-[10px] uppercase tracking-[0.2em] rounded-sm">
                Cancel
              </Button>
            </div>
          </div>
        </Scrollable>
      </div>
    </div>
  )
}

// ── Tattoo card ────────────────────────────────────────────────────────────
function TattooCard({ tattoo, onEdit }: { tattoo: Tattoo; onEdit: (t: Tattoo) => void }) {
  const [imgError, setImgError] = useState(false)
  return (
    <div className="group bg-[#1a1a1a] border border-white/10 rounded-sm overflow-hidden hover:border-[#ff5a66]/30 transition-colors">
      <div className="relative aspect-square bg-black/60 flex items-center justify-center overflow-hidden">
        {!imgError ? (
          <img
            src={tattooService.imageUrl(tattoo)}
            alt={tattoo.name}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <ImageIcon className="w-12 h-12 text-white/10" />
        )}
        {/* Edit overlay */}
        <button
          onClick={() => onEdit(tattoo)}
          className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <div className="flex flex-col items-center gap-1.5">
            <Pencil className="w-5 h-5 text-white" />
            <span className="text-[9px] uppercase tracking-[0.2em] text-white">Edit</span>
          </div>
        </button>
      </div>
      <div className="p-4 space-y-2">
        <p className="text-white/90 font-medium text-sm truncate">{tattoo.name}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-white/40">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-[11px]">{tattoo.time}h</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#ff5a66]">
            <DollarSign className="w-3.5 h-3.5" />
            <span className="text-[12px] font-medium">{tattoo.cost}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main page ──────────────────────────────────────────────────────────────
export default function TattooManagement() {
  const [tattoos,   setTattoos]   = useState<Tattoo[]>([])
  const [loading,   setLoading]   = useState(true)
  const [showForm,  setShowForm]  = useState(false)
  const [editTarget, setEditTarget] = useState<Tattoo | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [apiError,  setApiError]  = useState<string | null>(null)
  const [preview,   setPreview]   = useState<string | null>(null)

  const [name,        setName]        = useState('')
  const [cost,        setCost]        = useState('')
  const [time,        setTime]        = useState('')
  const [description, setDescription] = useState('')
  const [imageFile,   setImageFile]   = useState<File | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const res = await tattooService.getMany()
    if (res.ok) setTattoos(res.data)
    setLoading(false)
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setPreview(URL.createObjectURL(file))
  }

  function resetForm() {
    setName(''); setCost(''); setTime(''); setDescription('')
    setImageFile(null); setPreview(null); setApiError(null)
    setShowForm(false)
    if (fileRef.current) fileRef.current.value = ''
  }

  async function handleCreate() {
    if (!name || !cost || !time) { setApiError('Name, cost and time are required.'); return }
    if (!imageFile) { setApiError('Please upload an image.'); return }
    setSubmitting(true); setApiError(null)
    const res = await tattooService.createWithImage({ name, cost: parseFloat(cost), time, description, imageFile })
    setSubmitting(false)
    if (!res.ok) { setApiError(res.error?.message ?? 'Failed to create tattoo'); return }
    resetForm(); load()
  }

  function handleEdited(updated: Tattoo) {
    setTattoos(prev => prev.map(t => t.tattoo_id === updated.tattoo_id ? updated : t))
    setEditTarget(null)
  }

  return (
    <div className="h-full flex flex-col">

      <div className="shrink-0 px-8 pt-8 pb-6 flex items-center justify-between">
        <div>
          <h1 className="text-[48px] font-light text-white/95 leading-none" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Tattoo Catalog
          </h1>
          <p className="text-[11px] uppercase tracking-[0.25em] text-white/40 mt-2">
            {tattoos.length} design{tattoos.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={load} className="text-white/40 hover:text-white hover:bg-white/5">
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button onClick={() => { setShowForm(true); setApiError(null) }}
            className="h-10 bg-[#ff5a66] hover:bg-[#ff7078] text-black text-[10px] font-bold uppercase tracking-[0.3em] rounded-sm">
            <Plus className="w-4 h-4 mr-2" />New Design
          </Button>
        </div>
      </div>

      <Scrollable className="flex-1 min-h-0 px-8 pb-8">
        {loading ? (
          <div className="py-24 text-center text-white/30 text-sm">Loading...</div>
        ) : tattoos.length === 0 ? (
          <div className="py-24 text-center">
            <ImageIcon className="w-12 h-12 text-white/10 mx-auto mb-4" />
            <p className="text-white/30 text-sm">No designs yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {tattoos.map(t => <TattooCard key={t.tattoo_id} tattoo={t} onEdit={setEditTarget} />)}
          </div>
        )}
      </Scrollable>

      {/* Edit modal */}
      {editTarget && (
        <EditModal
          tattoo={editTarget}
          onClose={() => setEditTarget(null)}
          onSaved={handleEdited}
        />
      )}

      {/* Create modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-sm w-full max-w-lg mx-4 flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-8 py-6 border-b border-white/10 shrink-0">
              <h2 className="text-[28px] font-light text-white/95" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                New Design
              </h2>
              <button onClick={resetForm} className="text-white/40 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <Scrollable className="flex-1 min-h-0">
              <div className="px-8 py-6 space-y-6">
                <div>
                  <label className={labelCls}>Design Image <span className="text-[#ff5a66]">*</span></label>
                  <div onClick={() => fileRef.current?.click()}
                    className={`relative aspect-video min-h-[200px] rounded-sm border-2 border-dashed cursor-pointer overflow-hidden transition-colors ${preview ? 'border-[#ff5a66]/40' : 'border-white/10 hover:border-white/20'}`}>
                    {preview ? (
                      <img src={preview} alt="preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                        <Upload className="w-8 h-8 text-white/20" />
                        <p className="text-[11px] text-white/30 uppercase tracking-[0.2em]">Click to upload</p>
                        <p className="text-[10px] text-white/20">JPG, PNG, WEBP — max 5MB</p>
                      </div>
                    )}
                  </div>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                  {preview && (
                    <button onClick={() => { setPreview(null); setImageFile(null); if (fileRef.current) fileRef.current.value = '' }}
                      className="mt-2 text-[10px] uppercase tracking-[0.2em] text-[#ff5a66]/60 hover:text-[#ff5a66] transition-colors">
                      Remove image
                    </button>
                  )}
                </div>

                <div>
                  <label className={labelCls}>Name <span className="text-[#ff5a66]">*</span></label>
                  <input value={name} onChange={e => setName(e.target.value)} className={inputCls} placeholder="e.g. León Realista" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Cost (USD) <span className="text-[#ff5a66]">*</span></label>
                    <input value={cost} onChange={e => setCost(e.target.value)} type="number" min="0" step="0.01" className={inputCls} placeholder="150.00" />
                  </div>
                  <div>
                    <label className={labelCls}>Duration (HH:MM) <span className="text-[#ff5a66]">*</span></label>
                    <input value={time} onChange={e => setTime(e.target.value)} className={inputCls} placeholder="02:30" />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Description <span className="text-white/20 normal-case tracking-normal font-normal">optional</span></label>
                  <textarea value={description} onChange={e => setDescription(e.target.value)} rows={2}
                    className="w-full bg-[#0a0a0a] border border-white/10 text-white/80 text-[13px] px-3 py-2.5 rounded-sm outline-none focus:border-[#ff5a66] transition-colors placeholder:text-white/20 resize-none"
                    placeholder="Style, placement, details..." />
                </div>

                {apiError && (
                  <p className="text-[10px] uppercase tracking-wider text-[#ff5a66] border border-[#ff5a66]/20 bg-[#ff5a66]/5 px-4 py-3">
                    {apiError}
                  </p>
                )}

                <div className="flex gap-3 pt-2">
                  <Button onClick={handleCreate} disabled={submitting}
                    className="flex-1 h-12 bg-[#ff5a66] hover:bg-[#ff7078] text-black text-[10px] font-bold uppercase tracking-[0.3em] rounded-sm disabled:opacity-40">
                    {submitting ? 'Saving...' : 'Save Design'}
                  </Button>
                  <Button variant="ghost" onClick={resetForm}
                    className="h-12 px-6 border border-white/10 text-white/40 hover:text-white hover:border-white/20 text-[10px] uppercase tracking-[0.2em] rounded-sm">
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
