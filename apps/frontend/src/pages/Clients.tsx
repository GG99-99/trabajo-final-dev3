import { useState, useEffect, useMemo } from 'react'
import Scrollable from '@/componentes/Scrollable'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Button } from '@/componentes/ui/button'
import {
  Users, Plus, X, Search, RefreshCw,
  Mail, FileText, User, Calendar, ChevronDown, ChevronUp, Trash2
} from 'lucide-react'
import { clientService } from '@/lib/people.service'
import Tooltip from '@/componentes/Tooltip'
import ConfirmModal from '@/componentes/ConfirmModal'
import { appointmentService, type Appointment } from '@/lib/appointment.service'
import type { ClientPublic } from '@final/shared'

// ── form schema ────────────────────────────────────────────────────────────
const schema = yup.object({
  first_name:    yup.string().required('First name is required'),
  last_name:     yup.string().required('Last name is required'),
  email:         yup.string().email('Invalid email').required('Email is required'),
  medical_notes: yup.string(),
}).required()

type FormData = yup.InferType<typeof schema>

const inputCls  = "w-full border-b border-white/15 bg-transparent pb-2 text-[13px] text-white/90 outline-none transition-all focus:border-[#ff5a66] placeholder:text-white/20"
const labelCls  = "block text-[9px] font-semibold uppercase tracking-[0.3em] text-white/30 mb-2"

const STATUS_STYLES: Record<string, string> = {
  pending:   'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  completed: 'bg-[#ff5a66]/10 text-[#ff5a66] border-[#ff5a66]/20',
  expired:   'bg-white/5 text-white/30 border-white/10',
  cancelled: 'bg-red-900/20 text-red-400 border-red-500/20',
}

// ── component ──────────────────────────────────────────────────────────────
export default function Clients() {
  const [clients, setClients]           = useState<ClientPublic[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading]           = useState(true)
  const [search, setSearch]             = useState('')
  const [showForm, setShowForm]         = useState(false)
  const [submitting, setSubmitting]     = useState(false)
  const [apiError, setApiError]         = useState<string | null>(null)
  const [expanded, setExpanded]         = useState<number | null>(null)
  const [deleting, setDeleting]         = useState<number | null>(null)
  const [confirmId, setConfirmId]       = useState<number | null>(null)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema),
  })

  useEffect(() => { loadAll() }, [])

  async function loadAll() {
    setLoading(true)
    const [cliRes, apptRes] = await Promise.all([
      clientService.getAll(),
      appointmentService.getMany(),
    ])
    if (cliRes.ok)  setClients(cliRes.data)
    if (apptRes.ok) setAppointments(apptRes.data)
    setLoading(false)
  }

  // ── filtered clients ─────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    if (!q) return clients
    return clients.filter(c =>
      c.first_name.toLowerCase().includes(q) ||
      c.last_name.toLowerCase().includes(q)  ||
      c.email.toLowerCase().includes(q)
    )
  }, [clients, search])

  // ── appointments per client ───────────────────────────────────────────────
  const clientAppointments = (client_id: number) =>
    appointments.filter(a => a.client_id === client_id)

  // ── soft delete ───────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (confirmId === null) return
    setDeleting(confirmId)
    const res = await clientService.softDelete(confirmId)
    setDeleting(null)
    setConfirmId(null)
    if (res.ok) {
      setClients(prev => prev.filter(c => c.client_id !== confirmId))
      if (expanded === confirmId) setExpanded(null)
    }
  }

  // ── create client ─────────────────────────────────────────────────────────
  const onSubmit = async (data: FormData) => {
    setSubmitting(true)
    setApiError(null)
    const res = await clientService.create({
      first_name:    data.first_name,
      last_name:     data.last_name,
      email:         data.email,
      password:      '',
      type:          'client',
      medical_notes: data.medical_notes || undefined,
    })
    setSubmitting(false)
    if (!res.ok) { setApiError(res.error.message); return }
    reset()
    setShowForm(false)
    loadAll()
  }

  return (
    <div className="h-full flex flex-col">

      {/* ── TOP BAR ── */}
      <div className="shrink-0 px-8 pt-8 pb-6 flex items-center justify-between">
        <div>
          <h1
            className="text-[48px] font-light text-white/95 leading-none"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Clients
          </h1>
          <p className="text-[11px] uppercase tracking-[0.25em] text-white/40 mt-2">
            {filtered.length} registered client{filtered.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            onClick={loadAll}
            className="text-white/40 hover:text-white hover:bg-white/5"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => { setShowForm(true); setApiError(null) }}
            className="h-10 bg-[#ff5a66] hover:bg-[#ff7078] text-black text-[10px] font-bold uppercase tracking-[0.3em] rounded-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Client
          </Button>
        </div>
      </div>

      {/* ── SEARCH ── */}
      <div className="shrink-0 px-8 pb-6">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-[#1a1a1a] border border-white/10 text-white/80 text-[13px] pl-10 pr-4 py-2.5 rounded-sm outline-none focus:border-[#ff5a66] placeholder:text-white/25 transition-colors"
          />
        </div>
      </div>

      {/* ── CLIENT LIST ── */}
      <Scrollable className="flex-1 min-h-0 px-8 pb-8">
        {loading ? (
          <div className="py-24 text-center text-white/30 text-sm">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="py-24 text-center">
            <Users className="w-12 h-12 text-white/10 mx-auto mb-4" />
            <p className="text-white/30 text-sm">No clients found</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map(client => {
              const appts   = clientAppointments(client.client_id)
              const isOpen  = expanded === client.client_id
              const pending = appts.filter(a => a.status === 'pending').length

              return (
                <div
                  key={client.client_id}
                  className="bg-[#1a1a1a] border border-white/10 rounded-sm overflow-hidden transition-colors hover:border-white/20"
                >
                  {/* ── main row ── */}
                  <div className="flex items-center gap-4 p-5">
                    {/* avatar */}
                    <div className="w-11 h-11 bg-[#ff5a66]/10 rounded-full flex items-center justify-center shrink-0">
                      <User className="w-5 h-5 text-[#ff5a66]" />
                    </div>

                    {/* name + email */}
                    <div className="flex-1 min-w-0">
                      <p className="text-white/90 font-medium text-sm">
                        {client.first_name} {client.last_name}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Mail className="w-3 h-3 text-white/30 shrink-0" />
                        <p className="text-[11px] text-white/40 truncate">{client.email}</p>
                      </div>
                    </div>

                    {/* medical notes badge */}
                    {client.medical_notes && (
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-full shrink-0">
                        <FileText className="w-3 h-3 text-yellow-400" />
                        <span className="text-[9px] uppercase tracking-[0.2em] text-yellow-400">
                          Medical notes
                        </span>
                      </div>
                    )}

                    {/* appointments count */}
                    <div className="text-right shrink-0">
                      <p className="text-[22px] font-light text-white/90 leading-none"
                        style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                        {appts.length}
                      </p>
                      <p className="text-[9px] uppercase tracking-[0.2em] text-white/30 mt-0.5">
                        appt{appts.length !== 1 ? 's' : ''}
                      </p>
                    </div>

                    {/* pending badge */}
                    {pending > 0 && (
                      <span className="text-[9px] uppercase tracking-[0.2em] px-2 py-1 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-full shrink-0">
                        {pending} pending
                      </span>
                    )}

                    {/* expand toggle */}
                    <button
                      onClick={() => setExpanded(isOpen ? null : client.client_id)}
                      className="text-white/30 hover:text-white transition-colors shrink-0 ml-2"
                    >
                      {isOpen
                        ? <ChevronUp className="w-4 h-4" />
                        : <ChevronDown className="w-4 h-4" />
                      }
                    </button>

                    {/* soft delete */}
                    <Tooltip content="Delete client" position="top">
                      <button
                        onClick={() => setConfirmId(client.client_id)}
                        className="text-white/20 hover:text-red-400 transition-colors shrink-0 disabled:opacity-40"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </Tooltip>
                  </div>

                  {/* ── expanded detail ── */}
                  {isOpen && (
                    <div className="border-t border-white/10 px-5 pb-5 pt-4 space-y-5">

                      {/* IDs row */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className={labelCls}>Client ID</p>
                          <p className="text-white/70 text-sm font-mono">#{client.client_id}</p>
                        </div>
                        <div>
                          <p className={labelCls}>Person ID</p>
                          <p className="text-white/70 text-sm font-mono">#{client.person_id}</p>
                        </div>
                      </div>

                      {/* medical notes */}
                      {client.medical_notes && (
                        <div>
                          <p className={labelCls}>Medical Notes</p>
                          <p className="text-white/70 text-sm leading-relaxed bg-yellow-500/5 border border-yellow-500/10 rounded-sm px-4 py-3">
                            {client.medical_notes}
                          </p>
                        </div>
                      )}

                      {/* appointments */}
                      <div>
                        <p className={labelCls}>
                          Appointment History
                          <span className="ml-2 text-white/20 normal-case tracking-normal">
                            ({appts.length})
                          </span>
                        </p>

                        {appts.length === 0 ? (
                          <p className="text-white/30 text-sm py-2">No appointments yet.</p>
                        ) : (
                          <div className="space-y-2 mt-2">
                            {appts.map(a => (
                              <div
                                key={a.appointment_id}
                                className="flex items-center justify-between px-4 py-3 bg-black/40 border border-white/10 rounded-sm"
                              >
                                <div className="flex items-center gap-3">
                                  <Calendar className="w-4 h-4 text-white/30 shrink-0" />
                                  <div>
                                    <p className="text-white/80 text-sm">
                                      {new Date(a.date + 'T12:00:00').toLocaleDateString('en-US', {
                                        weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
                                      })}
                                    </p>
                                    <p className="text-[10px] uppercase tracking-[0.15em] text-white/40">
                                      {a.start} – {a.end} · Worker #{a.worker_id}
                                    </p>
                                  </div>
                                </div>
                                <span className={`text-[9px] uppercase tracking-[0.2em] px-3 py-1 rounded-full border ${STATUS_STYLES[a.status]}`}>
                                  {a.status}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </Scrollable>

      {/* ── CREATE MODAL ── */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-sm w-full max-w-lg mx-4 flex flex-col max-h-[90vh]">

            <div className="flex items-center justify-between px-8 py-6 border-b border-white/10 shrink-0">
              <h2
                className="text-[28px] font-light text-white/95"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                New Client
              </h2>
              <button
                onClick={() => { setShowForm(false); reset() }}
                className="text-white/40 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <Scrollable className="flex-1 min-h-0">
              <form onSubmit={handleSubmit(onSubmit)} className="px-8 py-6 space-y-8">

                <div className="grid grid-cols-2 gap-6">
                  <div className="group relative">
                    <label className={labelCls}>First Name</label>
                    <input {...register('first_name')} className={inputCls} placeholder="John" />
                    {errors.first_name && <p className="absolute -bottom-5 text-[9px] uppercase tracking-wider text-[#ff5a66]/90">{errors.first_name.message}</p>}
                  </div>
                  <div className="group relative">
                    <label className={labelCls}>Last Name</label>
                    <input {...register('last_name')} className={inputCls} placeholder="Doe" />
                    {errors.last_name && <p className="absolute -bottom-5 text-[9px] uppercase tracking-wider text-[#ff5a66]/90">{errors.last_name.message}</p>}
                  </div>
                </div>

                <div className="group relative">
                  <label className={labelCls}>Email Address</label>
                  <input {...register('email')} type="email" className={inputCls} placeholder="client@example.com" />
                  {errors.email && <p className="absolute -bottom-5 text-[9px] uppercase tracking-wider text-[#ff5a66]/90">{errors.email.message}</p>}
                </div>

                <div className="group relative">
                  <label className={labelCls}>Medical Notes <span className="text-white/20 normal-case tracking-normal">(optional)</span></label>
                  <textarea
                    {...register('medical_notes')}
                    rows={3}
                    className="w-full border border-white/15 bg-transparent rounded-sm p-3 text-[13px] text-white/90 outline-none transition-all focus:border-[#ff5a66] placeholder:text-white/20 resize-none"
                    placeholder="Allergies, skin conditions, contraindications..."
                  />
                </div>

                {apiError && (
                  <p className="text-[10px] uppercase tracking-wider text-[#ff5a66] border border-[#ff5a66]/20 bg-[#ff5a66]/5 px-4 py-3">
                    {apiError}
                  </p>
                )}

                <div className="flex gap-3 pt-2">
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 h-12 bg-[#ff5a66] hover:bg-[#ff7078] text-black text-[10px] font-bold uppercase tracking-[0.3em] rounded-sm"
                  >
                    {submitting ? 'Creating...' : 'Create Client'}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => { setShowForm(false); reset() }}
                    className="h-12 px-6 border border-white/10 text-white/40 hover:text-white hover:border-white/20 text-[10px] uppercase tracking-[0.2em] rounded-sm"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Scrollable>
          </div>
        </div>
      )}

      {/* ── CONFIRM DELETE MODAL ── */}
      <ConfirmModal
        open={confirmId !== null}
        title="Delete client?"
        description={
          confirmId !== null
            ? `${clients.find(c => c.client_id === confirmId)?.first_name} ${clients.find(c => c.client_id === confirmId)?.last_name} will be removed. This action can be undone by re-registering with the same email.`
            : undefined
        }
        confirmLabel="Delete"
        loading={deleting !== null}
        onConfirm={handleDelete}
        onCancel={() => setConfirmId(null)}
      />
    </div>
  )
}
