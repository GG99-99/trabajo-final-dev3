import { useState, useEffect } from 'react'
import Scrollable from '@/componentes/Scrollable'
import { Button } from '@/componentes/ui/button'
import {
  RefreshCw, ChevronDown, ChevronRight, DollarSign,
  CreditCard, Banknote, ArrowLeftRight, Receipt,
  User, X, Filter, Scissors, Download, FileText, Package
} from 'lucide-react'
import {
  billService,
  type Bill, type BillStatus, type Payment,
  type BillTattooItem, type BillProductItem,
} from '@/lib/bill.service'
import { clientService, workerService } from '@/lib/people.service'
import type { WorkerPublic, ClientPublic } from '@final/shared'
import { generatePaymentPDF } from '@/lib/pdf.utils'

// ── helpers ────────────────────────────────────────────────────────────────
const fmt = (n: number | string) =>
  Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const formatDT = (iso: string) => {
  const d = new Date(iso)
  return (
    d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
    ' · ' +
    d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  )
}

// ── status styles ──────────────────────────────────────────────────────────
const BILL_STATUS_STYLE: Record<BillStatus, string> = {
  pending:   'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  partially: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  paid:      'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  cancelled: 'bg-red-900/20 text-red-400 border-red-500/20',
  refunded:  'bg-white/5 text-white/30 border-white/10',
}

const METHOD_ICON: Record<string, React.ReactNode> = {
  cash:        <Banknote       className="w-3.5 h-3.5" />,
  credit_card: <CreditCard     className="w-3.5 h-3.5" />,
  transfer:    <ArrowLeftRight className="w-3.5 h-3.5" />,
}

const METHOD_LABEL: Record<string, string> = {
  cash:        'Cash',
  credit_card: 'Card',
  transfer:    'Transfer',
}

// ── shared tiny components ─────────────────────────────────────────────────
function Section({ title, icon, children }: {
  title: string; icon: React.ReactNode; children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-white/30">
        {icon}
        <span className="text-[9px] uppercase tracking-[0.3em]">{title}</span>
      </div>
      <div className="space-y-1">{children}</div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-[11px] uppercase tracking-[0.15em] text-white/30 shrink-0">{label}</span>
      <span className="text-[12px] text-white/70 text-right">{value}</span>
    </div>
  )
}

function LineItem({ label, amount }: { label: string; amount: number }) {
  const neg = amount < 0
  return (
    <div className="flex items-center justify-between px-3 py-1.5 bg-black/30 border border-white/10 rounded-sm text-[12px]">
      <span className="text-white/60 truncate">{label}</span>
      <span className={neg ? 'text-emerald-400' : 'text-white/80'}>
        {neg ? '-' : ''}${fmt(Math.abs(amount))}
      </span>
    </div>
  )
}

// ── full detail data loaded fresh from the API ─────────────────────────────
type DetailData = {
  bill:       Bill
  tattoos:    BillTattooItem[]
  products:   BillProductItem[]
  total:      number | null
  totalDiscount: number | null
}

// ── detail panel (right side) ──────────────────────────────────────────────
function DetailPanel({
  billId, clientName, workerName, onClose,
}: {
  billId:      number
  clientName:  string
  workerName:  string
  onClose:     () => void
}) {
  const [data,    setData]    = useState<DetailData | null>(null)
  const [loading, setLoading] = useState(true)
  const [pdfLoading, setPdfLoading] = useState(false)

  // ── load full detail when billId changes ───────────────────────────────
  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setData(null)

    async function load() {
      const [billRes, tattoosRes, productsRes, totalRes] = await Promise.all([
        billService.getOne(billId, true),
        billService.getTattoos(billId),
        billService.getStockMovements(billId),
        billService.getTotal(billId),
      ])

      if (cancelled) return

      setData({
        bill:          billRes.ok  ? billRes.data  : null as unknown as Bill,
        tattoos:       tattoosRes.ok  ? tattoosRes.data  : [],
        products:      productsRes.ok ? productsRes.data : [],
        total:         totalRes.ok ? totalRes.data.total : null,
        totalDiscount: totalRes.ok ? totalRes.data.total_discount : null,
      })
      setLoading(false)
    }

    load()
    return () => { cancelled = true }
  }, [billId])

  const handleDownloadPDF = () => {
    if (!data?.bill) return
    setPdfLoading(true)
    try {
      generatePaymentPDF({
        bill:       data.bill,
        tattoos:    data.tattoos,
        products:   data.products,
        total:      data.total,
        clientName,
        workerName,
      })
    } finally {
      setPdfLoading(false)
    }
  }

  // ── loading skeleton ─────────────────────────────────────────────────
  if (loading || !data?.bill) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 shrink-0">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/30">Bill Detail</p>
            <div className="h-6 w-16 bg-white/5 rounded mt-1 animate-pulse" />
          </div>
          <button onClick={onClose} className="text-white/30 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <RefreshCw className="w-5 h-5 text-white/20 animate-spin" />
        </div>
      </div>
    )
  }

  const { bill, tattoos, products, total, totalDiscount } = data
  const payments   = (bill.payments   ?? []) as Payment[]
  const aggregates = (bill.aggregates ?? []) as { bill_aggregate_id: number; amount: number | string; reason: string }[]
  const discounts  = (bill.discounts  ?? []) as { bill_discount_id:  number; amount: number | string; reason: string }[]
  const totalPaid  = payments.filter(p => !p.is_refunded).reduce((s, p) => s + Number(p.amount), 0)
  const balance    = total !== null ? total - totalPaid : null

  return (
    <div className="flex flex-col h-full">

      {/* ── header ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 shrink-0">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/30">Bill Detail</p>
          <h3
            className="text-[22px] font-light text-white/95 leading-tight mt-0.5"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            #{bill.bill_id}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadPDF}
            disabled={pdfLoading}
            title="Download PDF"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm border border-[#ff5a66]/30 text-[#ff5a66]/70 hover:text-[#ff5a66] hover:bg-[#ff5a66]/10 hover:border-[#ff5a66]/60 transition-all text-[10px] uppercase tracking-[0.15em] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {pdfLoading
              ? <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              : <Download  className="w-3.5 h-3.5" />}
            <span>PDF</span>
          </button>
          <button onClick={onClose} className="text-white/30 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <Scrollable className="flex-1 min-h-0">
        <div className="px-6 py-5 space-y-6">

          {/* ── meta ─────────────────────────────────────────────────── */}
          <div className="space-y-2">
            <Row label="Client"  value={clientName} />
            <Row label="Worker"  value={workerName} />
            <Row label="Created" value={formatDT(bill.create_at)} />
            <Row label="Status"  value={
              <span className={`text-[9px] uppercase tracking-[0.2em] px-2 py-0.5 rounded-full border ${BILL_STATUS_STYLE[bill.status]}`}>
                {bill.status}
              </span>
            } />
          </div>

          {/* ── tattoo services ────────────────────────────────────── */}
          {tattoos.length > 0 && (
            <Section title="Tattoo Services" icon={<Scissors className="w-3.5 h-3.5" />}>
              {tattoos.map((t, i) => (
                <LineItem key={i} label={`Tattoo #${t.tattoo_id}`} amount={Number(t.price ?? 0)} />
              ))}
            </Section>
          )}

          {/* ── products / stock movements ──────────────────────────── */}
          {products.length > 0 && (
            <Section title="Products" icon={<Package className="w-3.5 h-3.5" />}>
              {products.map((p, i) => (
                <div key={i} className="flex items-center justify-between px-3 py-1.5 bg-black/30 border border-white/10 rounded-sm text-[12px]">
                  <div className="min-w-0">
                    <span className="text-white/70 truncate block">{p.product_name}</span>
                    <span className="text-white/30 text-[10px]">{p.presentation} · qty {p.stock_movement_quantity}</span>
                  </div>
                  <span className="text-white/80 shrink-0 ml-3">${fmt(p.price)}</span>
                </div>
              ))}
            </Section>
          )}

          {/* ── aggregates ──────────────────────────────────────────── */}
          {aggregates.length > 0 && (
            <Section title="Aggregates" icon={<span className="text-[11px] font-bold">+</span>}>
              {aggregates.map(a => (
                <LineItem key={a.bill_aggregate_id} label={a.reason} amount={Number(a.amount)} />
              ))}
            </Section>
          )}

          {/* ── discounts ───────────────────────────────────────────── */}
          {discounts.length > 0 && (
            <Section title="Discounts" icon={<span className="text-[11px] font-bold">−</span>}>
              {discounts.map(d => (
                <LineItem key={d.bill_discount_id} label={d.reason} amount={-Number(d.amount)} />
              ))}
            </Section>
          )}

          {/* ── financial summary ───────────────────────────────────── */}
          <div className="bg-black/30 border border-white/10 rounded-sm px-4 py-4 space-y-2">
            <p className="text-[9px] uppercase tracking-[0.3em] text-white/25 mb-3">Summary</p>
            {total !== null && (
              <Row label="Total" value={
                <span className="text-white/90 font-semibold">${fmt(total)}</span>
              } />
            )}
            {totalDiscount !== null && totalDiscount > 0 && (
              <Row label="Discount" value={
                <span className="text-emerald-400">-${fmt(totalDiscount)}</span>
              } />
            )}
            <Row label="Paid" value={
              <span className="text-emerald-400">${fmt(totalPaid)}</span>
            } />
            {balance !== null && (
              <div className="border-t border-white/10 pt-2 mt-1">
                <Row label="Balance" value={
                  <span className={balance > 0.005 ? 'text-yellow-400 font-semibold' : 'text-white/30'}>
                    ${fmt(Math.max(0, balance))}
                  </span>
                } />
              </div>
            )}
          </div>

          {/* ── payments list ───────────────────────────────────────── */}
          <Section title="Payments" icon={<DollarSign className="w-3.5 h-3.5" />}>
            {payments.length === 0 ? (
              <p className="text-[12px] text-white/25 italic px-1">No payments recorded</p>
            ) : payments.map(p => (
              <div
                key={p.payment_id}
                className={`flex items-center justify-between px-3 py-2.5 rounded-sm border text-[12px] ${
                  p.is_refunded
                    ? 'bg-white/3 border-white/5 opacity-45'
                    : 'bg-black/30 border-white/10'
                }`}
              >
                <div className="flex items-center gap-2 text-white/50 min-w-0">
                  {METHOD_ICON[p.method]}
                  <span className="text-white/70">{METHOD_LABEL[p.method]}</span>
                  {p.transaction_ref && (
                    <span className="text-white/20 text-[10px] truncate">· {p.transaction_ref}</span>
                  )}
                  {p.is_refunded && (
                    <span className="text-[9px] uppercase tracking-[0.15em] text-red-400/70 shrink-0">refunded</span>
                  )}
                </div>
                <span className={`shrink-0 ml-3 ${p.is_refunded ? 'line-through text-white/20' : 'text-white/90 font-medium'}`}>
                  ${fmt(p.amount)}
                </span>
              </div>
            ))}
          </Section>

          {/* ── PDF hint ─────────────────────────────────────────────── */}
          <div className="flex items-center gap-2 px-3 py-2.5 bg-[#ff5a66]/5 border border-[#ff5a66]/15 rounded-sm">
            <FileText className="w-3.5 h-3.5 text-[#ff5a66]/50 shrink-0" />
            <p className="text-[10px] text-white/30 leading-snug">
              Click <span className="text-[#ff5a66]/60 font-semibold">PDF</span> para descargar el reporte completo de este bill.
            </p>
          </div>

        </div>
      </Scrollable>
    </div>
  )
}

// ── payment summary shown inside the expanded row ──────────────────────────
function PaymentSummaryCard({ payments }: { payments: Payment[] }) {
  if (payments.length === 0) {
    return (
      <div className="px-3 py-3 bg-black/20 border border-white/5 rounded-sm">
        <p className="text-[11px] text-white/25 italic">No payments recorded</p>
      </div>
    )
  }
  return (
    <div className="space-y-1">
      {payments.map(p => (
        <div
          key={p.payment_id}
          className={`flex items-center justify-between px-3 py-2 rounded-sm border text-[12px] ${
            p.is_refunded
              ? 'bg-white/3 border-white/5 opacity-40'
              : 'bg-black/30 border-white/10'
          }`}
        >
          <div className="flex items-center gap-2 text-white/40">
            {METHOD_ICON[p.method]}
            <span className="text-white/60">{METHOD_LABEL[p.method]}</span>
            {p.transaction_ref && (
              <span className="text-white/20 text-[10px]">· {p.transaction_ref}</span>
            )}
            {p.is_refunded && (
              <span className="text-[9px] uppercase tracking-[0.15em] text-red-400/60">refunded</span>
            )}
          </div>
          <span className={p.is_refunded ? 'line-through text-white/20 text-[11px]' : 'text-white/85 font-medium'}>
            ${fmt(p.amount)}
          </span>
        </div>
      ))}
    </div>
  )
}

// ── main page ──────────────────────────────────────────────────────────────
export default function PaymentsPage() {
  const [bills,   setBills]   = useState<Bill[]>([])
  const [workers, setWorkers] = useState<WorkerPublic[]>([])
  const [clients, setClients] = useState<ClientPublic[]>([])
  const [totals,  setTotals]  = useState<Record<number, number>>({})
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState<string | null>(null)

  const [expanded,      setExpanded]      = useState<Set<number>>(new Set())
  const [detailBillId,  setDetailBillId]  = useState<number | null>(null)

  const [filterStatus, setFilterStatus] = useState<BillStatus | ''>('')
  const [filterDate,   setFilterDate]   = useState('')

  useEffect(() => { loadAll() }, [])

  async function loadAll() {
    setLoading(true)
    setError(null)
    setDetailBillId(null)
    setExpanded(new Set())

    const [billRes, workerRes, clientRes] = await Promise.all([
      billService.getMany({ relations: true }),
      workerService.getAll(),
      clientService.getAll(),
    ])

    if (!billRes.ok) {
      setError(billRes.error?.message ?? 'Error al cargar bills')
      setLoading(false)
      return
    }

    const billList = billRes.data ?? []
    setBills(billList)
    if (workerRes.ok) setWorkers(workerRes.data)
    if (clientRes.ok) setClients(clientRes.data)

    // fetch totals in parallel
    const totalsMap: Record<number, number> = {}
    await Promise.all(
      billList.map(async b => {
        const res = await billService.getTotal(b.bill_id)
        if (res.ok) totalsMap[b.bill_id] = res.data.total
      })
    )
    setTotals(totalsMap)
    setLoading(false)
  }

  const workerName = (id: number) => {
    const w = workers.find(w => w.worker_id === id)
    return w ? `${w.first_name} ${w.last_name}` : `#${id}`
  }
  const clientName = (id: number | null | undefined) => {
    if (!id) return 'Walk-in'
    const c = clients.find(c => c.client_id === id)
    return c ? `${c.first_name} ${c.last_name}` : `#${id}`
  }

  const toggleExpand = (id: number) =>
    setExpanded(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  const filtered = bills.filter(b => {
    if (filterStatus && b.status !== filterStatus) return false
    if (filterDate   && !b.create_at.startsWith(filterDate)) return false
    return true
  })

  const ALL_STATUSES: BillStatus[] = ['pending', 'partially', 'paid', 'cancelled', 'refunded']
  const panelOpen = detailBillId !== null

  // find the bill object for the selected detail (for quick PDF from list)
  const detailBill = detailBillId !== null
    ? bills.find(b => b.bill_id === detailBillId) ?? null
    : null

  return (
    <div className="h-full flex overflow-hidden">

      {/* ── LEFT: bill list ─────────────────────────────────────────────── */}
      <div className={`flex flex-col transition-all duration-300 ${panelOpen ? 'w-[55%]' : 'w-full'} min-w-0 h-full`}>

        {/* TOP BAR */}
        <div className="shrink-0 px-8 pt-8 pb-6 flex items-center justify-between">
          <div>
            <h1
              className="text-[48px] font-light text-white/95 leading-none"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              Payments
            </h1>
            <p className="text-[11px] uppercase tracking-[0.25em] text-white/40 mt-2">
              {filtered.length} bill{filtered.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Button variant="ghost" onClick={loadAll} className="text-white/40 hover:text-white hover:bg-white/5">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>

        {/* FILTERS */}
        <div className="shrink-0 px-8 pb-5 flex items-center gap-4 flex-wrap">
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
            onChange={e => setFilterStatus(e.target.value as BillStatus | '')}
            className="bg-[#1a1a1a] border border-white/10 text-white/70 text-[12px] px-3 py-2 rounded-sm outline-none focus:border-[#ff5a66] cursor-pointer [&>option]:bg-[#1a1a1a]"
          >
            <option value="">All statuses</option>
            {ALL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          {(filterDate || filterStatus) && (
            <button
              onClick={() => { setFilterDate(''); setFilterStatus('') }}
              className="text-[10px] uppercase tracking-[0.2em] text-[#ff5a66]/60 hover:text-[#ff5a66] transition-colors"
            >
              Clear
            </button>
          )}
        </div>

        {/* BILL LIST */}
        <Scrollable className="flex-1 min-h-0 px-8 pb-8">
          {loading ? (
            <div className="py-24 text-center">
              <RefreshCw className="w-6 h-6 text-white/20 animate-spin mx-auto mb-3" />
              <p className="text-white/30 text-sm">Cargando datos...</p>
            </div>
          ) : error ? (
            <div className="py-24 text-center space-y-3">
              <p className="text-red-400/70 text-sm">{error}</p>
              <button
                onClick={loadAll}
                className="text-[10px] uppercase tracking-[0.2em] text-[#ff5a66]/60 hover:text-[#ff5a66] transition-colors"
              >
                Reintentar
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-24 text-center">
              <Receipt className="w-12 h-12 text-white/10 mx-auto mb-4" />
              <p className="text-white/30 text-sm">No bills found</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map(bill => {
                const isExpanded = expanded.has(bill.bill_id)
                const isSelected = detailBillId === bill.bill_id
                const total      = totals[bill.bill_id] ?? null
                const payments   = (bill.payments ?? []) as Payment[]
                const totalPaid  = payments
                  .filter(p => !p.is_refunded)
                  .reduce((s, p) => s + Number(p.amount), 0)

                return (
                  <div
                    key={bill.bill_id}
                    className={`bg-[#1a1a1a] border rounded-sm transition-colors ${
                      isSelected
                        ? 'border-[#ff5a66]/40'
                        : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    {/* collapsed header row */}
                    <div className="flex items-center gap-3 px-5 py-4">

                      <button
                        onClick={() => toggleExpand(bill.bill_id)}
                        className="text-white/25 hover:text-white/60 transition-colors shrink-0"
                      >
                        {isExpanded
                          ? <ChevronDown  className="w-4 h-4" />
                          : <ChevronRight className="w-4 h-4" />}
                      </button>

                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-9 h-9 bg-white/5 rounded-full flex items-center justify-center shrink-0">
                          <User className="w-4 h-4 text-white/40" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-white/90 text-sm truncate font-medium">
                            {clientName(bill.client_id)}
                          </p>
                          <p className="text-[10px] uppercase tracking-[0.12em] text-white/30 truncate">
                            {workerName(bill.worker_id)} · {formatDT(bill.create_at)}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="text-white/80 text-sm font-semibold">
                          {total !== null ? `$${fmt(total)}` : '—'}
                        </p>
                        <p className="text-[10px] text-emerald-400/70 mt-0.5">
                          {total !== null && totalPaid > 0
                            ? totalPaid >= total ? 'Paid in full' : `$${fmt(totalPaid)} paid`
                            : ''}
                        </p>
                      </div>

                      <span className={`text-[9px] uppercase tracking-[0.2em] px-3 py-1 rounded-full border whitespace-nowrap shrink-0 ${BILL_STATUS_STYLE[bill.status]}`}>
                        {bill.status}
                      </span>

                      <button
                        onClick={() => setDetailBillId(isSelected ? null : bill.bill_id)}
                        className={`shrink-0 text-[9px] uppercase tracking-[0.2em] px-3 py-1.5 rounded-sm border transition-colors ${
                          isSelected
                            ? 'bg-[#ff5a66]/20 text-[#ff5a66] border-[#ff5a66]/40'
                            : 'border-white/10 text-white/30 hover:text-white/60 hover:border-white/25'
                        }`}
                      >
                        Detail
                      </button>
                    </div>

                    {/* expanded: payment list */}
                    {isExpanded && (
                      <div className="px-5 pb-5 border-t border-white/10 pt-4">
                        <p className="text-[9px] uppercase tracking-[0.3em] text-white/25 mb-3">
                          Payments · {payments.length} record{payments.length !== 1 ? 's' : ''}
                        </p>
                        <PaymentSummaryCard payments={payments} />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </Scrollable>
      </div>

      {/* ── RIGHT: detail panel ─────────────────────────────────────────── */}
      {panelOpen && detailBillId !== null && detailBill && (
        <div className="w-[45%] shrink-0 bg-[#111111] border-l border-white/10 flex flex-col h-full">
          <DetailPanel
            key={detailBillId}
            billId={detailBillId}
            clientName={clientName(detailBill.client_id)}
            workerName={workerName(detailBill.worker_id)}
            onClose={() => setDetailBillId(null)}
          />
        </div>
      )}
    </div>
  )
}
