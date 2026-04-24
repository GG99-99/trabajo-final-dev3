/**
 * queueWorker.ts
 * Handler central que procesa las escrituras encoladas en Redis
 * cuando el core (Prisma / PostgreSQL) vuelve a estar disponible.
 *
 * Módulos soportados:
 *   punch   → clockIn, clockOut
 *   payment → create
 *   bill    → create
 *   audit   → log
 */

import type { QueuedWrite } from './lib/writeQueue.js'
import { punchService } from './modules/punch/punch.service.js'
import { paymentService } from './modules/payment/payment.service.js'
import { billService } from './modules/bill/bill.service.js'
import { auditModel } from './modules/audit/audit.model.js'
import type { CreatePayment } from '@final/shared'
import type { CreateFullBill } from '@final/shared'

export async function queueHandler(item: QueuedWrite): Promise<void> {
  const key = `${item.module}:${item.action}`

  switch (key) {
    /* ── PUNCH ─────────────────────────────────────────────── */
    case 'punch:clockIn': {
      const { worker_id } = item.payload as { worker_id: number }
      await punchService.clockIn(worker_id)
      break
    }
    case 'punch:clockOut': {
      const { worker_id } = item.payload as { worker_id: number }
      await punchService.clockOut(worker_id)
      break
    }

    /* ── PAYMENT ────────────────────────────────────────────── */
    case 'payment:create': {
      const data = item.payload as unknown as CreatePayment
      await paymentService.create(data)
      break
    }

    /* ── BILL ───────────────────────────────────────────────── */
    case 'bill:create': {
      const data = item.payload as unknown as CreateFullBill
      await billService.create(data)
      break
    }

    /* ── AUDIT ──────────────────────────────────────────────── */
    case 'audit:log': {
      // Los logs encolados se guardan directo via model (sin pasar por service
      // para evitar recursión de circuit breaker)
      await auditModel.create(item.payload as Parameters<typeof auditModel.create>[0])
      break
    }

    default:
      console.warn(`[queue-worker] acción desconocida: ${key} — descartando`)
  }
}
