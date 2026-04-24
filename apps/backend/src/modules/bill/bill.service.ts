/**
 * bill.service.ts — con resiliencia Redis
 *
 * Estrategia:
 *   - Lecturas: protegidas con circuit breaker.
 *   - create (CreateFullBill): operación crítica con transacción.
 *     Si el core cae (503), se encola en Redis.
 *   - updateState: solo dentro de transacciones existentes (no encola).
 */

import { stockMovementService } from '../stockMovement/stockMovement.service.js'
import {
  GetManyBill,
  GetBill,
  CreateFullBill,
  CreateBillTattoo,
  UpdateBillStatus,
  BillFinance,
} from '@final/shared'
import { billModel } from './bill.model.js'
import prisma, { Prisma } from '@final/db'
import { withCircuitBreaker } from '../../lib/circuitBreaker.js'
import { enqueueWrite } from '../../lib/writeQueue.js'

export const billService = {
  getMany: async (filters: GetManyBill) => {
    return await withCircuitBreaker(() => billModel.getMany(filters))
  },

  get: async (filters: GetBill) => {
    return await withCircuitBreaker(() => billModel.get(filters))
  },

  getTotal: async (bill_id: number): Promise<BillFinance> => {
    return await withCircuitBreaker(async () => {
      const bill = await billModel.get({ bill_id, relations: true })
      if (!bill) throw {}

      const tattoos = await billService.getTattoos(bill_id)
      const costs = await Promise.all(
        bill.details.map((ag: any) => stockMovementService.getCost(ag.stock_movement_id))
      )

      const itemsTotal       = costs.reduce((acc: number, cost: number) => acc + cost, 0)
      const aggregatesTotal  = bill.aggregates.reduce((acc: number, ag: any) => acc + Number(ag.amount), 0)
      const tattoosTotal     = tattoos.reduce((acc: number, t: any) => acc + Number(t.price), 0)
      const discountTotal    = bill.discounts.reduce((acc: number, d: any) => acc + Number(d.amount), 0)
      const paymentsTotal    = bill.payments
        .filter((p: any) => !p.is_refunded)
        .reduce((acc: number, p: any) => acc + Number(p.amount), 0)

      const total    = aggregatesTotal + tattoosTotal + itemsTotal
      const rawDebt  = total - discountTotal - paymentsTotal
      const debt     = Math.max(0, rawDebt)
      const overpaid = rawDebt < 0 ? Math.abs(rawDebt) : 0

      return {
        bill_id,
        total,
        total_discount: discountTotal,
        total_after_discount: total - discountTotal,
        debt,
        overpaid,
      }
    })
  },

  getStockMovements: async (bill_id: number) => {
    return await withCircuitBreaker(() => billModel.getStockMovements(bill_id))
  },

  getTattoos: async (bill_id: number) => {
    return await withCircuitBreaker(() => billModel.getTattoos(bill_id))
  },

  /***********
  |   CREATE  |
   ***********/
  create: async (data: CreateFullBill) => {
    try {
      return await withCircuitBreaker(() =>
        prisma.$transaction(async (tx) => {
          const bill = await billModel.create(
            {
              client_id: data.client_id,
              worker_id: data.worker_id,
              cashier_id: data.cashier_id,
              appointment_id: data.appointment_id ?? undefined,
              create_at: data.create_at,
            },
            tx
          )

          for (const item of data.items) {
            const stockMovement = await stockMovementService.createForProductVariant(
              {
                product_variant_id: item.product_variant_id,
                reason: `factura ${bill.bill_id}`,
                type: 'exit',
                quantity: item.quantity,
              },
              tx
            )
            await billModel.createBillDetail(
              { bill_id: bill.bill_id, stock_movement_id: stockMovement.stock_movement_id },
              tx
            )
          }

          for (const tattoo_id of data.tatto_ids) {
            await billModel.createBillTatto({ tattoo_id, bill_id: bill.bill_id }, tx)
          }

          for (const agg of data.extra.aggregates) {
            await billModel.createBillAggregate({ bill_id: bill.bill_id, amount: agg.amount, reason: agg.reason }, tx)
          }

          for (const dis of data.extra.discounts) {
            await billModel.createBillDiscount({ bill_id: bill.bill_id, amount: dis.amount, reason: dis.reason }, tx)
          }

          return bill
        })
      )
    } catch (err: any) {
      if (err?.statusCode === 503) {
        await enqueueWrite('bill', 'create', data as unknown as Record<string, unknown>)
        return {
          queued: true,
          message: 'Factura registrada localmente. Se procesará cuando el servidor esté disponible.',
        }
      }
      throw err
    }
  },

  createBillTattoo: async (data: CreateBillTattoo, tx: Prisma.TransactionClient) => {
    return await billModel.createBillTatto(data, tx)
  },

  /***********
  |   UPDATE  |
   ***********/
  updateState: async (data: UpdateBillStatus, tx: Prisma.TransactionClient) => {
    return await billModel.updateStatus(data, tx)
  },

  updateStateDirect: async (data: UpdateBillStatus) => {
    return await withCircuitBreaker(() =>
      prisma.$transaction(async (tx) => billModel.updateStatus(data, tx))
    )
  },
}
