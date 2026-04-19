import { useState, useEffect, useRef } from 'react'
import Scrollable from '@/componentes/Scrollable'
import { Button } from '@/componentes/ui/button'
import {
  User, Users, Shield, Trash2, Ban, CheckCircle,
  Plus, X, ChevronDown, Eye, EyeOff, RefreshCw,
  Save, AlertTriangle, Pencil, Key, Copy, Check, RotateCcw, Clock
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { personService, type PersonFull, type UpdatePersonPayload } from '@/lib/people.service'
import { authService, type AdminTokens } from '@/lib/auth.service'

// ── helpers ────────────────────────────────────────────────────────────────
const isAdmin = (tag?: string | null) => tag === 'admin'

const TYPE_STYLE: Record<string, string> = {
  worker:  'bg-[#ff5a66]/10 text-[#ff5a66] border-[#ff5a66]/20',
  cashier: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  client:  'bg-white/5 text-white/40 border-white/10',
}

const inputCls =
  'w-full bg-[#0a0a0a] border border-white/10 text-white/80 text-[13px] px-3 py-2.5 rounded-sm outline-none focus:border-[#ff5a66] transition-colors placeholder:text-white/20'
const labelCls =
  'block text-[9px] font-semibold uppercase tracking-[0.3em] text-white/30 mb-1.5'
const selectCls =
  'w-full bg-[#0a0a0a] border border-white/10 text-white/80 text-[13px] px-3 py-2.5 rounded-sm outline-none focus:border-[#ff5a66] cursor-pointer appearance-none [&>option]:bg-[#1a1a1a] transition-colors'

// ── tiny shared components ─────────────────────────────────────────────────
function Field({
  label, value, onChange, type = 'text', placeholder, rightSlot,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  placeholder?: string
  rightSlot?: React.ReactNode
}) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className={inputCls + (rightSlot ? ' pr-10' : '')}
        />
        {rightSlot && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightSlot}</div>
        )}
      </div>
    </div>
  )
}

function StatusMsg({ ok, msg }: { ok: boolean; msg: string }) {
  if (!msg) return null
  return (
    <p className={`text-[11px] px-3 py-2 rounded-sm border ${
      ok
        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
        : 'bg-[#ff5a66]/5 text-[#ff5a66] border-[#ff5a66]/20'
    }`}>
      {msg}
    </p>
  )
}

// ── Profile edit form (used for own profile AND admin editing others) ──────
function ProfileForm({
  person,
  onSaved,
  title,
  subtitle,
}: {
  person: PersonFull
  onSaved?: (updated: PersonFull) => void
  title?: string
  subtitle?: string
}) {
  const [firstName,    setFirstName]    = useState(person.first_name)
  const [lastName,     setLastName]     = useState(person.last_name)
  const [email,        setEmail]        = useState(person.email)
  const [password,     setPassword]     = useState('')
  const [showPass,     setShowPass]     = useState(false)
  const [specialty,    setSpecialty]    = useState(person.worker?.specialty ?? '')
  const [medicalNotes, setMedicalNotes] = useState(person.client?.medical_notes ?? '')
  const [saving,       setSaving]       = useState(false)
  const [status,       setStatus]       = useState<{ ok: boolean; msg: string } | null>(null)

  const handleSave = async () => {
    setSaving(true)
    setStatus(null)
    const payload: UpdatePersonPayload = {
      person_id: person.person_id,
      first_name: firstName || undefined,
      last_name:  lastName  || undefined,
      email:      email     || undefined,
      password:   password  || undefined,
      specialty:  specialty || undefined,
      medical_notes: person.type === 'client' ? medicalNotes : undefined,
    }
    const res = await personService.update(payload)
    setSaving(false)
    if (res.ok) {
      setPassword('')
      setStatus({ ok: true, msg: 'Profile updated successfully.' })
      onSaved?.(res.data)
    } else {
      setStatus({ ok: false, msg: res.error.message })
    }
  }

  return (
    <div className="space-y-5">
      {title && (
        <div className="mb-2">
          <h3
            className="text-[22px] font-light text-white/90"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            {title}
          </h3>
          {subtitle && <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 mt-0.5">{subtitle}</p>}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <Field label="First name" value={firstName} onChange={setFirstName} placeholder="First name" />
        <Field label="Last name"  value={lastName}  onChange={setLastName}  placeholder="Last name" />
      </div>

      <Field label="Email" value={email} onChange={setEmail} placeholder="email@example.com" />

      <Field
        label="New password"
        value={password}
        onChange={setPassword}
        type={showPass ? 'text' : 'password'}
        placeholder="Leave blank to keep current"
        rightSlot={
          <button type="button" onClick={() => setShowPass(p => !p)} className="text-white/30 hover:text-white/60 transition-colors">
            {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        }
      />

      {person.type === 'worker' && (
        <div>
          <label className={labelCls}>Specialty</label>
          <div className="relative">
            <select
              value={specialty}
              onChange={e => setSpecialty(e.target.value)}
              className={selectCls}
            >
              <option value="realism">Realism</option>
              <option value="cartoon">Cartoon</option>
              <option value="other">Other</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
          </div>
        </div>
      )}

      {person.type === 'client' && (
        <div>
          <label className={labelCls}>Medical notes</label>
          <textarea
            value={medicalNotes}
            onChange={e => setMedicalNotes(e.target.value)}
            rows={3}
            placeholder="Any relevant medical information..."
            className={inputCls + ' resize-none'}
          />
        </div>
      )}

      {status && <StatusMsg ok={status.ok} msg={status.msg} />}

      <Button
        onClick={handleSave}
        disabled={saving}
        className="h-10 bg-[#ff5a66] hover:bg-[#ff7078] text-black text-[10px] font-bold uppercase tracking-[0.3em] rounded-sm disabled:opacity-40"
      >
        <Save className="w-4 h-4 mr-2" />
        {saving ? 'Saving…' : 'Save changes'}
      </Button>
    </div>
  )
}

// ── Create user modal ──────────────────────────────────────────────────────
function CreateUserModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [firstName,    setFirstName]    = useState('')
  const [lastName,     setLastName]     = useState('')
  const [email,        setEmail]        = useState('')
  const [password,     setPassword]     = useState('')
  const [type,         setType]         = useState<'worker' | 'cashier' | 'client'>('worker')
  const [specialty,    setSpecialty]    = useState<'realism' | 'cartoon' | 'other'>('other')
  const [medicalNotes, setMedicalNotes] = useState('')
  const [showPass,     setShowPass]     = useState(false)
  const [saving,       setSaving]       = useState(false)
  const [error,        setError]        = useState<string | null>(null)

  const handleCreate = async () => {
    if (!firstName || !lastName || !email || !password) {
      setError('All fields are required.')
      return
    }
    setSaving(true)
    setError(null)
    const res = await personService.create({
      first_name: firstName,
      last_name:  lastName,
      email,
      password,
      type,
      specialty:    type === 'worker' ? specialty : undefined,
      medical_notes: type === 'client' ? medicalNotes : undefined,
    })
    setSaving(false)
    if (res.ok) { onCreated() }
    else        { setError(res.error.message) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-[#1a1a1a] border border-white/10 rounded-sm w-full max-w-lg mx-4 flex flex-col max-h-[90vh]">

        <div className="flex items-center justify-between px-7 py-5 border-b border-white/10 shrink-0">
          <h2 className="text-[24px] font-light text-white/95" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Create User
          </h2>
          <button onClick={onClose} className="text-white/30 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <Scrollable className="flex-1 min-h-0">
          <div className="px-7 py-6 space-y-5">

            <div className="grid grid-cols-2 gap-4">
              <Field label="First name" value={firstName} onChange={setFirstName} placeholder="First name" />
              <Field label="Last name"  value={lastName}  onChange={setLastName}  placeholder="Last name" />
            </div>

            <Field label="Email" value={email} onChange={setEmail} placeholder="email@example.com" />

            <Field
              label="Password"
              value={password}
              onChange={setPassword}
              type={showPass ? 'text' : 'password'}
              placeholder="Initial password"
              rightSlot={
                <button type="button" onClick={() => setShowPass(p => !p)} className="text-white/30 hover:text-white/60 transition-colors">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />

            <div>
              <label className={labelCls}>Role</label>
              <div className="relative">
                <select value={type} onChange={e => setType(e.target.value as typeof type)} className={selectCls}>
                  <option value="worker">Worker</option>
                  <option value="cashier">Cashier</option>
                  <option value="client">Client</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
              </div>
            </div>

            {type === 'worker' && (
              <div>
                <label className={labelCls}>Specialty</label>
                <div className="relative">
                  <select value={specialty} onChange={e => setSpecialty(e.target.value as typeof specialty)} className={selectCls}>
                    <option value="realism">Realism</option>
                    <option value="cartoon">Cartoon</option>
                    <option value="other">Other</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                </div>
              </div>
            )}

            {type === 'client' && (
              <div>
                <label className={labelCls}>Medical notes</label>
                <textarea
                  value={medicalNotes}
                  onChange={e => setMedicalNotes(e.target.value)}
                  rows={3}
                  placeholder="Optional medical information..."
                  className={inputCls + ' resize-none'}
                />
              </div>
            )}

            {error && <StatusMsg ok={false} msg={error} />}

            <div className="flex gap-3 pt-1">
              <Button
                onClick={handleCreate}
                disabled={saving}
                className="flex-1 h-10 bg-[#ff5a66] hover:bg-[#ff7078] text-black text-[10px] font-bold uppercase tracking-[0.3em] rounded-sm disabled:opacity-40"
              >
                {saving ? 'Creating…' : 'Create user'}
              </Button>
              <Button
                variant="ghost"
                onClick={onClose}
                className="h-10 px-5 border border-white/10 text-white/40 hover:text-white hover:border-white/20 text-[10px] uppercase tracking-[0.2em] rounded-sm"
              >
                Cancel
              </Button>
            </div>
          </div>
        </Scrollable>
      </div>
    </div>
  )
}

// ── Confirm dialog ─────────────────────────────────────────────────────────
function ConfirmDialog({
  message, confirmLabel, danger, onConfirm, onCancel,
}: {
  message: string
  confirmLabel: string
  danger?: boolean
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-[#1a1a1a] border border-white/10 rounded-sm w-full max-w-sm mx-4 p-7 space-y-5">
        <div className="flex items-start gap-3">
          <AlertTriangle className={`w-5 h-5 shrink-0 mt-0.5 ${danger ? 'text-[#ff5a66]' : 'text-yellow-400'}`} />
          <p className="text-white/70 text-sm leading-relaxed">{message}</p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={onConfirm}
            className={`flex-1 h-9 text-[10px] font-bold uppercase tracking-[0.2em] rounded-sm ${
              danger
                ? 'bg-[#ff5a66] hover:bg-[#ff7078] text-black'
                : 'bg-yellow-500 hover:bg-yellow-400 text-black'
            }`}
          >
            {confirmLabel}
          </Button>
          <Button
            variant="ghost"
            onClick={onCancel}
            className="flex-1 h-9 border border-white/10 text-white/40 hover:text-white text-[10px] uppercase tracking-[0.2em] rounded-sm"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}

// ── User row card in the admin list ────────────────────────────────────────
function UserCard({
  person,
  onEdit,
  onBan,
  onDelete,
}: {
  person: PersonFull
  onEdit:   (p: PersonFull) => void
  onBan:    (p: PersonFull) => void
  onDelete: (p: PersonFull) => void
}) {
  const banned = person.is_deleted
  return (
    <div className={`flex items-center gap-4 px-5 py-4 border rounded-sm transition-colors ${
      banned
        ? 'bg-black/20 border-white/5 opacity-60'
        : 'bg-[#1a1a1a] border-white/10 hover:border-white/20'
    }`}>

      {/* avatar */}
      <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
        banned ? 'bg-white/5' : 'bg-[#ff5a66]/10'
      }`}>
        <User className={`w-4 h-4 ${banned ? 'text-white/20' : 'text-[#ff5a66]'}`} />
      </div>

      {/* info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-white/90 text-sm font-medium truncate">
            {person.first_name} {person.last_name}
          </p>
          {person.tag === 'admin' && (
            <span className="text-[8px] uppercase tracking-[0.2em] px-1.5 py-0.5 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-full shrink-0">
              admin
            </span>
          )}
          {banned && (
            <span className="text-[8px] uppercase tracking-[0.2em] px-1.5 py-0.5 bg-red-900/20 text-red-400 border border-red-500/20 rounded-full shrink-0">
              banned
            </span>
          )}
        </div>
        <p className="text-[10px] text-white/30 truncate mt-0.5">
          {person.email}
          {person.worker && ` · ${person.worker.specialty}`}
          {person.client?.medical_notes && ` · notes`}
        </p>
      </div>

      {/* role badge */}
      <span className={`text-[9px] uppercase tracking-[0.2em] px-3 py-1 rounded-full border whitespace-nowrap shrink-0 ${TYPE_STYLE[person.type]}`}>
        {person.type}
      </span>

      {/* actions */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={() => onEdit(person)}
          title="Edit"
          className="w-8 h-8 flex items-center justify-center text-white/25 hover:text-white/70 hover:bg-white/5 rounded transition-colors"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onBan(person)}
          title={banned ? 'Unban' : 'Ban'}
          className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${
            banned
              ? 'text-emerald-400/50 hover:text-emerald-400 hover:bg-emerald-500/10'
              : 'text-yellow-400/50 hover:text-yellow-400 hover:bg-yellow-500/10'
          }`}
        >
          {banned ? <CheckCircle className="w-3.5 h-3.5" /> : <Ban className="w-3.5 h-3.5" />}
        </button>
        <button
          onClick={() => onDelete(person)}
          title="Delete"
          className="w-8 h-8 flex items-center justify-center text-[#ff5a66]/30 hover:text-[#ff5a66] hover:bg-[#ff5a66]/10 rounded transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}

// ── Registration Tokens panel (admin only) ───────────────────────────────
function RegistrationTokens() {
  const [tokens,    setTokens]    = useState<AdminTokens | null>(null)
  const [loading,   setLoading]   = useState(false)
  const [refreshing,setRefreshing]= useState(false)
  const [copied,    setCopied]    = useState<'worker' | 'cashier' | null>(null)
  const [error,     setError]     = useState<string | null>(null)

  useEffect(() => { loadTokens() }, [])

  async function loadTokens() {
    setLoading(true)
    const res = await authService.getAdminTokens()
    setLoading(false)
    if (res.ok) setTokens(res.data)
    else setError(res.error.message)
  }

  async function handleRefresh() {
    setRefreshing(true)
    const res = await authService.refreshAdminTokens()
    setRefreshing(false)
    if (res.ok) setTokens(res.data)
    else setError(res.error.message)
  }

  function copy(text: string, which: 'worker' | 'cashier') {
    navigator.clipboard.writeText(text)
    setCopied(which)
    setTimeout(() => setCopied(null), 2000)
  }

  function formatExpiry(expiresAt: number): string {
    const diff = expiresAt - Date.now()
    if (diff <= 0) return 'Expired'
    const m = Math.floor(diff / 60000)
    const s = Math.floor((diff % 60000) / 1000)
    return `${m}m ${s}s`
  }

  function ExpiryBadge({ expiresAt }: { expiresAt: number }) {
    const [label, setLabel] = useState(formatExpiry(expiresAt))
    useEffect(() => {
      const t = setInterval(() => {
        const next = formatExpiry(expiresAt)
        setLabel(next)
        if (next === 'Expired') clearInterval(t)
      }, 1000)
      return () => clearInterval(t)
    }, [expiresAt])
    const expired = label === 'Expired'
    return (
      <span className={`inline-flex items-center gap-1 text-[9px] uppercase tracking-[0.2em] px-2 py-0.5 rounded-full border ${
        expired
          ? 'bg-red-900/20 text-red-400 border-red-500/20'
          : 'bg-emerald-500/8 text-emerald-400 border-emerald-500/20'
      }`}>
        <Clock className="w-2.5 h-2.5" />
        {label}
      </span>
    )
  }

  function TokenRow({ label, role, token, expiresAt }: {
    label: string; role: 'worker' | 'cashier'
    token: string; expiresAt: number
  }) {
    return (
      <div className="p-4 bg-black/40 border border-white/8 rounded-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key className="w-3.5 h-3.5 text-white/40" />
            <span className="text-[10px] uppercase tracking-[0.25em] text-white/50">{label}</span>
          </div>
          <ExpiryBadge expiresAt={expiresAt} />
        </div>
        <div className="flex items-center gap-2">
          <code className="flex-1 font-mono text-[11px] text-white/60 bg-white/[0.03] border border-white/8 rounded-sm px-3 py-2 truncate">
            {token || '—'}
          </code>
          <button
            onClick={() => copy(token, role)}
            disabled={!token}
            className="shrink-0 h-9 w-9 flex items-center justify-center border border-white/10 rounded-sm text-white/30 hover:text-white/70 hover:border-white/20 transition-colors disabled:opacity-30"
            title="Copy token"
          >
            {copied === role
              ? <Check className="w-3.5 h-3.5 text-emerald-400" />
              : <Copy className="w-3.5 h-3.5" />
            }
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#1a1a1a] border border-white/10 rounded-sm p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Key className="w-4 h-4 text-yellow-400" />
            <h3
              className="text-[22px] font-light text-white/90"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              Registration Tokens
            </h3>
          </div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/30">
            Share these with staff to allow self-registration · expire in 10 min
          </p>
        </div>
        <Button
          variant="ghost"
          onClick={handleRefresh}
          disabled={refreshing}
          title="Force regenerate tokens"
          className="h-9 w-9 p-0 border border-white/10 text-white/30 hover:text-yellow-400 hover:border-yellow-400/30 hover:bg-yellow-400/5 rounded-sm"
        >
          <RotateCcw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {error && (
        <p className="text-[11px] px-3 py-2 bg-[#ff5a66]/5 border border-[#ff5a66]/20 text-[#ff5a66] rounded-sm">{error}</p>
      )}

      {loading ? (
        <div className="py-8 text-center text-white/25 text-sm">Loading tokens…</div>
      ) : tokens ? (
        <>
          <TokenRow label="Artist token" role="worker"  token={tokens.tokenWorker.value}  expiresAt={tokens.tokenWorker.expiresAt}  />
          <TokenRow label="Cashier token" role="cashier" token={tokens.tokenCashier.value} expiresAt={tokens.tokenCashier.expiresAt} />
        </>
      ) : null}

      <div className="flex items-start gap-2 pt-1 text-[10px] text-white/25">
        <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5 text-yellow-400/50" />
        <span>Tokens regenerate automatically when expired. Use the button to force a new token before sharing.</span>
      </div>
    </div>
  )
}

// ── Main page ──────────────────────────────────────────────────────────────
export default function SettingsPage() {
  const { user, setUser } = useAuth()
  const admin = isAdmin(user?.tag)

  // own profile data
  const [ownProfile,  setOwnProfile]  = useState<PersonFull | null>(null)
  const [profileLoad, setProfileLoad] = useState(true)

  // admin: all users list
  const [allPersons, setAllPersons] = useState<PersonFull[]>([])
  const [usersLoad,  setUsersLoad]  = useState(false)

  // admin UI state
  const [editTarget,   setEditTarget]   = useState<PersonFull | null>(null)
  const [banTarget,    setBanTarget]    = useState<PersonFull | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<PersonFull | null>(null)
  const [showCreate,   setShowCreate]   = useState(false)
  const [actionMsg,    setActionMsg]    = useState<{ ok: boolean; msg: string } | null>(null)

  // filter
  const [filterType,   setFilterType]   = useState<'all' | 'worker' | 'cashier' | 'client'>('all')
  const [filterBanned, setFilterBanned] = useState<'all' | 'active' | 'banned'>('all')

  useEffect(() => { loadOwnProfile() }, [])
  useEffect(() => { if (admin) loadAllUsers() }, [admin])

  async function loadOwnProfile() {
    if (!user?.person_id) return
    setProfileLoad(true)
    const res = await personService.getOne({ person_id: user.person_id, noPass: true })
    if (res.ok) setOwnProfile(res.data)
    setProfileLoad(false)
  }

  async function loadAllUsers() {
    setUsersLoad(true)
    const res = await personService.getAll()
    if (res.ok) setAllPersons(res.data)
    setUsersLoad(false)
  }

  const flash = (ok: boolean, msg: string) => {
    setActionMsg({ ok, msg })
    setTimeout(() => setActionMsg(null), 4000)
  }

  // ban / unban
  const handleBan = async (person: PersonFull) => {
    const newBanned = !person.is_deleted
    const res = await personService.ban(person.person_id, newBanned)
    setBanTarget(null)
    if (res.ok) {
      setAllPersons(prev => prev.map(p => p.person_id === person.person_id ? { ...p, is_deleted: newBanned } : p))
      flash(true, `${person.first_name} ${newBanned ? 'banned' : 'unbanned'} successfully.`)
    } else {
      flash(false, res.error.message)
    }
  }

  // soft delete
  const handleDelete = async (person: PersonFull) => {
    const res = await personService.softDelete(person.person_id)
    setDeleteTarget(null)
    if (res.ok) {
      setAllPersons(prev => prev.filter(p => p.person_id !== person.person_id))
      flash(true, `${person.first_name} ${person.last_name} deleted.`)
    } else {
      flash(false, res.error.message)
    }
  }

  const filteredPersons = allPersons.filter(p => {
    if (filterType !== 'all' && p.type !== filterType) return false
    if (filterBanned === 'active' && p.is_deleted)  return false
    if (filterBanned === 'banned' && !p.is_deleted) return false
    return true
  })

  // ── render ───────────────────────────────────────────────────────────────
  return (
    <div className="h-full flex flex-col">

      {/* TOP BAR */}
      <div className="shrink-0 px-8 pt-8 pb-6 flex items-center justify-between">
        <div>
          <h1
            className="text-[48px] font-light text-white/95 leading-none"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Settings
          </h1>
          <p className="text-[11px] uppercase tracking-[0.25em] text-white/40 mt-2">
            {admin ? 'Administrator' : 'Worker'} · {user?.email}
          </p>
        </div>
        {admin && (
          <div className="flex items-center gap-2">
            {actionMsg && (
              <span className={`text-[11px] px-3 py-1.5 rounded-sm border ${
                actionMsg.ok
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : 'bg-[#ff5a66]/5 text-[#ff5a66] border-[#ff5a66]/20'
              }`}>
                {actionMsg.msg}
              </span>
            )}
            <Button
              onClick={() => setShowCreate(true)}
              className="h-10 bg-[#ff5a66] hover:bg-[#ff7078] text-black text-[10px] font-bold uppercase tracking-[0.3em] rounded-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              New user
            </Button>
          </div>
        )}
      </div>

      <Scrollable className="flex-1 min-h-0 px-8 pb-8">
        <div className={`${admin ? 'grid grid-cols-[380px_1fr] gap-8 items-start' : 'max-w-lg'}`}>

          {/* ── LEFT: own profile ── */}
          <div className="bg-[#1a1a1a] border border-white/10 rounded-sm p-6">
            <div className="flex items-center gap-3 mb-6 pb-5 border-b border-white/10">
              <div className="w-12 h-12 bg-[#ff5a66]/10 rounded-full flex items-center justify-center shrink-0">
                {admin
                  ? <Shield className="w-6 h-6 text-[#ff5a66]" />
                  : <User   className="w-6 h-6 text-[#ff5a66]" />
                }
              </div>
              <div>
                <p className="text-white/90 font-medium text-sm">
                  {user?.email}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`text-[9px] uppercase tracking-[0.2em] px-2 py-0.5 rounded-full border ${TYPE_STYLE[user?.type ?? 'worker']}`}>
                    {user?.type}
                  </span>
                  {admin && (
                    <span className="text-[9px] uppercase tracking-[0.2em] px-2 py-0.5 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-full">
                      admin
                    </span>
                  )}
                </div>
              </div>
            </div>

            {profileLoad ? (
              <div className="py-8 text-center text-white/30 text-sm">Loading…</div>
            ) : ownProfile ? (
              <ProfileForm
                person={ownProfile}
                title="My profile"
                subtitle="Edit your personal information"
                onSaved={updated => {
                  setOwnProfile(updated)
                  // update auth context if email changed
                  if (updated.email !== user?.email) {
                    setUser({ ...user!, email: updated.email })
                  }
                }}
              />
            ) : (
              <p className="text-white/30 text-sm">Could not load profile.</p>
            )}
          </div>

          {/* ── RIGHT: admin user management ── */}
          {admin && (
            <div className="space-y-5">

              {/* Registration tokens */}
              <RegistrationTokens />

              {/* section header + filters */}
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-white/40" />
                  <h2
                    className="text-[22px] font-light text-white/90"
                    style={{ fontFamily: 'Cormorant Garamond, serif' }}
                  >
                    User Management
                  </h2>
                  <span className="text-[10px] text-white/30 ml-1">
                    ({filteredPersons.length})
                  </span>
                </div>
                <Button
                  variant="ghost"
                  onClick={loadAllUsers}
                  disabled={usersLoad}
                  className="text-white/30 hover:text-white hover:bg-white/5 h-8 w-8 p-0"
                >
                  <RefreshCw className={`w-4 h-4 ${usersLoad ? 'animate-spin' : ''}`} />
                </Button>
              </div>

              {/* filters row */}
              <div className="flex items-center gap-3 flex-wrap">
                {(['all', 'worker', 'cashier', 'client'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setFilterType(t)}
                    className={`text-[9px] uppercase tracking-[0.2em] px-3 py-1.5 rounded-sm border transition-colors ${
                      filterType === t
                        ? 'bg-[#ff5a66]/15 text-[#ff5a66] border-[#ff5a66]/30'
                        : 'border-white/10 text-white/30 hover:text-white/60 hover:border-white/20'
                    }`}
                  >
                    {t}
                  </button>
                ))}
                <div className="w-px h-4 bg-white/10" />
                {(['all', 'active', 'banned'] as const).map(b => (
                  <button
                    key={b}
                    onClick={() => setFilterBanned(b)}
                    className={`text-[9px] uppercase tracking-[0.2em] px-3 py-1.5 rounded-sm border transition-colors ${
                      filterBanned === b
                        ? 'bg-white/10 text-white/80 border-white/20'
                        : 'border-white/10 text-white/30 hover:text-white/60 hover:border-white/20'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>

              {/* list */}
              {usersLoad ? (
                <div className="py-16 text-center text-white/30 text-sm">Loading users…</div>
              ) : filteredPersons.length === 0 ? (
                <div className="py-16 text-center">
                  <Users className="w-10 h-10 text-white/10 mx-auto mb-3" />
                  <p className="text-white/25 text-sm">No users found</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredPersons.map(p => (
                    <UserCard
                      key={p.person_id}
                      person={p}
                      onEdit={setEditTarget}
                      onBan={setBanTarget}
                      onDelete={setDeleteTarget}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </Scrollable>

      {/* ── MODALS ── */}

      {/* Edit user (admin editing someone else) */}
      {editTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-sm w-full max-w-lg mx-4 flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-7 py-5 border-b border-white/10 shrink-0">
              <h2 className="text-[24px] font-light text-white/95" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                Edit User
              </h2>
              <button onClick={() => setEditTarget(null)} className="text-white/30 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <Scrollable className="flex-1 min-h-0">
              <div className="px-7 py-6">
                <ProfileForm
                  person={editTarget}
                  onSaved={updated => {
                    setAllPersons(prev => prev.map(p => p.person_id === updated.person_id ? updated : p))
                    setEditTarget(null)
                    flash(true, `${updated.first_name} ${updated.last_name} updated.`)
                  }}
                />
              </div>
            </Scrollable>
          </div>
        </div>
      )}

      {/* Ban confirm */}
      {banTarget && (
        <ConfirmDialog
          message={
            banTarget.is_deleted
              ? `Unban ${banTarget.first_name} ${banTarget.last_name}? They will regain access.`
              : `Ban ${banTarget.first_name} ${banTarget.last_name}? They will lose access immediately.`
          }
          confirmLabel={banTarget.is_deleted ? 'Unban' : 'Ban'}
          danger={!banTarget.is_deleted}
          onConfirm={() => handleBan(banTarget)}
          onCancel={() => setBanTarget(null)}
        />
      )}

      {/* Delete confirm */}
      {deleteTarget && (
        <ConfirmDialog
          message={`Permanently delete ${deleteTarget.first_name} ${deleteTarget.last_name}? This cannot be undone.`}
          confirmLabel="Delete"
          danger
          onConfirm={() => handleDelete(deleteTarget)}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {/* Create user */}
      {showCreate && (
        <CreateUserModal
          onClose={() => setShowCreate(false)}
          onCreated={() => { setShowCreate(false); loadAllUsers(); flash(true, 'User created successfully.') }}
        />
      )}
    </div>
  )
}
