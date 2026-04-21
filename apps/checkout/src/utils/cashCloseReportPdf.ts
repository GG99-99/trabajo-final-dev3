import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { BillFinance, BillWithRelations } from '@final/shared'

export type CashCloseBillRow = {
  bill: BillWithRelations
  finance: BillFinance
}

export type CashCloseTotals = {
  totalIncome: number
  totalDiscount: number
  totalCollected: number
  totalPending: number
}

function formatMoney(n: number) {
  return `$${n.toFixed(2)}`
}

function personName(
  person: { first_name?: string | null; last_name?: string | null } | null | undefined,
) {
  if (!person) return '—'
  const parts = [person.first_name, person.last_name].filter(Boolean)
  return parts.length ? parts.join(' ') : '—'
}

export function downloadCashCloseReportPdf(params: {
  reportDate: string
  rows: CashCloseBillRow[]
  totals: CashCloseTotals
}) {
  const { reportDate, rows, totals } = params
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const pageW = doc.internal.pageSize.getWidth()
  const margin = 14
  let y = margin

  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('Reporte de cierre de facturación', margin, y)
  y += 8

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(`Fecha operativa: ${reportDate}`, margin, y)
  y += 5
  doc.text(`Generado: ${new Date().toLocaleString('es-ES')}`, margin, y)
  y += 10

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.text('Resumen', margin, y)
  y += 6
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  const summaryLines = [
    ['Total de entrada', formatMoney(totals.totalIncome)],
    ['Descuentos', formatMoney(totals.totalDiscount)],
    ['Total cobrado', formatMoney(totals.totalCollected)],
    ['Pendiente de cobro', formatMoney(totals.totalPending)],
  ] as const
  for (const [label, value] of summaryLines) {
    doc.text(`${label}:`, margin, y)
    doc.text(value, pageW - margin - doc.getTextWidth(value), y)
    y += 5
  }
  y += 4

  doc.setFont('helvetica', 'bold')
  doc.text(`Facturas del día (${rows.length})`, margin, y)
  y += 4

  if (rows.length === 0) {
    doc.setFont('helvetica', 'italic')
    doc.setFontSize(10)
    doc.text('No hay facturas registradas para esta fecha.', margin, y)
  } else {
    const body = rows.map(({ bill, finance }) => {
      const paid = finance.total - finance.debt
      return [
        String(bill.bill_id),
        personName(bill.client?.person),
        personName(bill.worker?.person),
        formatMoney(finance.total),
        formatMoney(finance.total_discount),
        formatMoney(finance.total_after_discount),
        formatMoney(paid),
        formatMoney(finance.debt),
        String(bill.status ?? ''),
      ]
    })

    autoTable(doc, {
      startY: y,
      margin: { left: margin, right: margin },
      head: [
        [
          'ID',
          'Cliente',
          'Trabajador',
          'Total',
          'Desc.',
          'Neto',
          'Pagado',
          'Deuda',
          'Estado',
        ],
      ],
      body,
      styles: { fontSize: 8, cellPadding: 1.5 },
      headStyles: { fillColor: [55, 65, 81], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      columnStyles: {
        0: { cellWidth: 12 },
        1: { cellWidth: 28 },
        2: { cellWidth: 28 },
        3: { cellWidth: 22 },
        4: { cellWidth: 18 },
        5: { cellWidth: 22 },
        6: { cellWidth: 22 },
        7: { cellWidth: 22 },
        8: { cellWidth: 18 },
      },
    })
  }

  const safeName = reportDate.replaceAll(/[^\d-]/g, '')
  doc.save(`cierre-facturacion-${safeName || 'fecha'}.pdf`)
}
