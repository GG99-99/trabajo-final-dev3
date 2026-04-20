import jsPDF from 'jspdf'
import type { Bill, Payment, BillTattooItem, BillProductItem } from './bill.service'

// ─── colour helpers ──────────────────────────────────────────────────────────
type RGB = [number, number, number]
const BLACK:  RGB = [15,  15,  15]
const WHITE:  RGB = [255, 255, 255]
const ACCENT: RGB = [255, 90,  102]
const LIGHT:  RGB = [245, 245, 245]
const MUTED:  RGB = [180, 180, 180]
const GREY:   RGB = [120, 120, 120]
const DKGREY: RGB = [40,  40,  40]
const ROWALT: RGB = [252, 252, 252]

// ─── value helpers ───────────────────────────────────────────────────────────
const fmt = (n: number | string) =>
  `$${Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

const formatDT = (iso: string) => {
  const d = new Date(iso)
  return (
    d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
    '  ' +
    d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  )
}

const METHOD_LABEL: Record<string, string> = {
  cash: 'Cash', credit_card: 'Credit Card', transfer: 'Transfer',
}

// ─── manual table renderer ───────────────────────────────────────────────────
interface ColDef {
  header: string
  width:  number
  align?: 'left' | 'right' | 'center'
}

function drawTable(
  doc:     jsPDF,
  startY:  number,
  marginL: number,
  cols:    ColDef[],
  rows:    string[][],
): number {
  const HEADER_H = 20
  const ROW_H    = 18
  const PAD      = 5
  const totalW   = cols.reduce((s, c) => s + c.width, 0)

  // header
  doc.setFillColor(...BLACK)
  doc.rect(marginL, startY, totalW, HEADER_H, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(...WHITE)
  let cx = marginL
  for (const col of cols) {
    const tx = col.align === 'right' ? cx + col.width - PAD
             : col.align === 'center' ? cx + col.width / 2
             : cx + PAD
    doc.text(col.header, tx, startY + 13, { align: col.align ?? 'left' })
    cx += col.width
  }

  // rows
  let y = startY + HEADER_H
  for (let r = 0; r < rows.length; r++) {
    doc.setFillColor(...(r % 2 === 0 ? WHITE : ROWALT))
    doc.rect(marginL, y, totalW, ROW_H, 'F')
    doc.setDrawColor(220, 220, 220)
    doc.line(marginL, y + ROW_H, marginL + totalW, y + ROW_H)

    cx = marginL
    for (let c = 0; c < cols.length; c++) {
      const col = cols[c]
      const val = rows[r][c] ?? ''
      const tx  = col.align === 'right' ? cx + col.width - PAD
                : col.align === 'center' ? cx + col.width / 2
                : cx + PAD

      if (col.header === 'Status') {
        const color: RGB = val === 'Refunded' ? [220, 60, 60] : [40, 160, 100]
        doc.setTextColor(...color)
        doc.setFont('helvetica', 'bold')
      } else {
        doc.setTextColor(...DKGREY)
        doc.setFont('helvetica', 'normal')
      }
      doc.setFontSize(8.5)

      let display = val
      while (doc.getTextWidth(display) > col.width - PAD * 2 && display.length > 3) {
        display = display.slice(0, -4) + '...'
      }
      doc.text(display, tx, y + 12, { align: col.align ?? 'left' })
      cx += col.width
    }
    y += ROW_H
  }

  // outer border
  doc.setDrawColor(...DKGREY)
  doc.rect(marginL, startY, totalW, HEADER_H + ROW_H * rows.length, 'S')

  return y + 6
}

// ─── main export ─────────────────────────────────────────────────────────────
export function generatePaymentPDF(opts: {
  bill:        Bill
  tattoos:     BillTattooItem[]
  products:    BillProductItem[]
  total:       number | null
  clientName:  string
  workerName:  string
}) {
  const { bill, tattoos, products, total, clientName, workerName } = opts

  const payments   = (bill.payments   ?? []) as Payment[]
  const aggregates = (bill.aggregates ?? []) as { bill_aggregate_id: number; amount: number | string; reason: string }[]
  const discounts  = (bill.discounts  ?? []) as { bill_discount_id:  number; amount: number | string; reason: string }[]

  const totalPaid = payments.filter(p => !p.is_refunded).reduce((s, p) => s + Number(p.amount), 0)
  const balance   = total !== null ? Math.max(0, total - totalPaid) : null

  const doc = new jsPDF({ unit: 'pt', format: 'letter' })
  const PW  = doc.internal.pageSize.getWidth()
  const PH  = doc.internal.pageSize.getHeight()
  const ML  = 30

  // ── header bar ────────────────────────────────────────────────────────────
  doc.setFillColor(...BLACK)
  doc.rect(0, 0, PW, 90, 'F')
  doc.setFillColor(...ACCENT)
  doc.rect(0, 0, 5, 90, 'F')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(22)
  doc.setTextColor(...WHITE)
  doc.text('OBSIDIAN', 28, 38)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(...MUTED)
  doc.text('TATTOO & STUDIO', 28, 52)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(26)
  doc.setTextColor(...WHITE)
  doc.text(`#${bill.bill_id}`, PW - 30, 42, { align: 'right' })

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(...MUTED)
  doc.text('BILL ID', PW - 30, 54, { align: 'right' })

  const STATUS_BG: Record<string, RGB> = {
    pending: [255, 200, 50], partially: [80, 150, 255],
    paid: [50, 200, 120], cancelled: [220, 60, 60], refunded: [120, 120, 120],
  }
  doc.setFillColor(...(STATUS_BG[bill.status] ?? GREY))
  doc.roundedRect(PW - 115, 60, 85, 18, 4, 4, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(7.5)
  doc.setTextColor(...BLACK)
  doc.text(bill.status.toUpperCase(), PW - 72.5, 72, { align: 'center' })

  // ── info strip ────────────────────────────────────────────────────────────
  let y = 108
  doc.setFillColor(...LIGHT)
  doc.rect(ML, y, PW - ML * 2, 58, 'F')

  const il = (txt: string, x: number, yy: number) => {
    doc.setFont('helvetica', 'normal'); doc.setFontSize(7); doc.setTextColor(...GREY)
    doc.text(txt.toUpperCase(), x, yy)
  }
  const iv = (txt: string, x: number, yy: number) => {
    doc.setFont('helvetica', 'bold'); doc.setFontSize(9.5); doc.setTextColor(...DKGREY)
    doc.text(txt, x, yy)
  }

  const c1 = ML + 12, c2 = 200, c3 = 370
  il('Client',     c1, y + 14); iv(clientName,               c1, y + 27)
  il('Worker',     c2, y + 14); iv(workerName,               c2, y + 27)
  il('Date',       c3, y + 14); iv(formatDT(bill.create_at), c3, y + 27)
  il('Cashier ID', c1, y + 42); iv(String(bill.cashier_id ?? '—'), c1, y + 53)
  il('Status',     c2, y + 42); iv(bill.status.charAt(0).toUpperCase() + bill.status.slice(1), c2, y + 53)

  y += 74

  const section = (title: string) => {
    doc.setFillColor(...DKGREY)
    doc.rect(ML, y, PW - ML * 2, 18, 'F')
    doc.setFont('helvetica', 'bold'); doc.setFontSize(7.5); doc.setTextColor(...WHITE)
    doc.text(title.toUpperCase(), ML + 8, y + 12)
    y += 22
  }

  // ── tattoo services ───────────────────────────────────────────────────────
  if (tattoos.length > 0) {
    section('Tattoo Services')
    y = drawTable(doc, y, ML,
      [{ header: 'Tattoo ID', width: 120 }, { header: 'Price', width: 100, align: 'right' }],
      tattoos.map(t => [`#${t.tattoo_id}`, fmt(t.price ?? 0)]),
    )
  }

  // ── products ──────────────────────────────────────────────────────────────
  if (products.length > 0) {
    section('Products')
    const TW = PW - ML * 2
    y = drawTable(doc, y, ML,
      [
        { header: 'Product',      width: TW - 120 - 60 - 80 },
        { header: 'Presentation', width: 120 },
        { header: 'Qty',          width: 60, align: 'center' },
        { header: 'Price',        width: 80, align: 'right' },
      ],
      products.map(p => [
        p.product_name,
        p.presentation,
        String(p.stock_movement_quantity),
        fmt(p.price),
      ]),
    )
  }

  // ── aggregates ────────────────────────────────────────────────────────────
  if (aggregates.length > 0) {
    section('Aggregates')
    y = drawTable(doc, y, ML,
      [{ header: 'Reason', width: PW - ML * 2 - 120 }, { header: 'Amount', width: 120, align: 'right' }],
      aggregates.map(a => [a.reason, fmt(a.amount)]),
    )
  }

  // ── discounts ─────────────────────────────────────────────────────────────
  if (discounts.length > 0) {
    section('Discounts')
    y = drawTable(doc, y, ML,
      [{ header: 'Reason', width: PW - ML * 2 - 120 }, { header: 'Amount', width: 120, align: 'right' }],
      discounts.map(d => [d.reason, fmt(d.amount)]),
    )
  }

  // ── payment records ───────────────────────────────────────────────────────
  section('Payment Records')
  if (payments.length === 0) {
    doc.setFont('helvetica', 'italic'); doc.setFontSize(9); doc.setTextColor(...GREY)
    doc.text('No payments recorded.', ML + 8, y + 12)
    y += 28
  } else {
    const TW = PW - ML * 2
    y = drawTable(doc, y, ML,
      [
        { header: 'Payment ID', width: 70 },
        { header: 'Method',     width: 90 },
        { header: 'Ref',        width: 110 },
        { header: 'Amount',     width: 80,  align: 'right' },
        { header: 'Status',     width: 72,  align: 'center' },
        { header: 'Date',       width: TW - 70 - 90 - 110 - 80 - 72 },
      ],
      payments.map(p => [
        `#${p.payment_id}`,
        METHOD_LABEL[p.method] ?? p.method,
        p.transaction_ref || '—',
        fmt(p.amount),
        p.is_refunded ? 'Refunded' : 'Confirmed',
        formatDT(p.create_at),
      ]),
    )
  }

  // ── financial summary box ─────────────────────────────────────────────────
  const summaryLines = [
    ...(total   !== null ? [['TOTAL',   fmt(total),   WHITE]]                                                     as [string,string,RGB][] : []),
    [            'PAID',   fmt(totalPaid), [80, 210, 130] as RGB] as [string,string,RGB],
    ...(balance !== null ? [['BALANCE', fmt(balance), (balance > 0.005 ? [255,200,60] : GREY) as RGB]] as [string,string,RGB][] : []),
  ]

  const BOX_W = 210
  const BOX_H = summaryLines.length * 22 + 20
  const BOX_X = PW - ML - BOX_W

  doc.setFillColor(...DKGREY)
  doc.roundedRect(BOX_X, y, BOX_W, BOX_H, 4, 4, 'F')

  let by = y + 18
  for (let i = 0; i < summaryLines.length; i++) {
    const [label, value, color] = summaryLines[i]
    if (i > 0) {
      doc.setDrawColor(70, 70, 70)
      doc.line(BOX_X + 10, by - 4, BOX_X + BOX_W - 10, by - 4)
    }
    doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5); doc.setTextColor(...MUTED)
    doc.text(label, BOX_X + 12, by)
    doc.setFont('helvetica', 'bold'); doc.setFontSize(10); doc.setTextColor(...color)
    doc.text(value, BOX_X + BOX_W - 12, by, { align: 'right' })
    by += 22
  }

  // ── footer ────────────────────────────────────────────────────────────────
  const FY = PH - 36
  doc.setFillColor(...BLACK)
  doc.rect(0, FY, PW, 36, 'F')
  doc.setFillColor(...ACCENT)
  doc.rect(0, FY, 5, 36, 'F')
  doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5); doc.setTextColor(150, 150, 150)
  doc.text('Generated by Obsidian Studio Management System', 28, FY + 22)
  doc.text(
    new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }),
    PW - 30, FY + 22, { align: 'right' },
  )

  doc.save(`bill-${bill.bill_id}.pdf`)
}
