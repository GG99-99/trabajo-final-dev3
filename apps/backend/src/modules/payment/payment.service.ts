/**
 * payment.service.ts — con resiliencia Redis
 *
 * Estrategia:
 *   - Lecturas (get, getMany, getManyByMonth): protegidas con circuit breaker.
 *     Si el core cae, devuelven error 503 claro en vez de timeout.
 *   - Escritura (create): es una operación CRÍTICA con transacción Prisma.
 *     Si el core cae, se encola en Redis con todos los datos necesarios.
 *     El queue worker la procesa cuando el core se recupera.
 *     El cliente recibe confirmación inmediata con estado "queued".
 *
 * IMPORTANTE: Los pagos encolados no tienen devuelta calculada hasta que
 * se procesen. La UI del checkout debe manejar el estado `queued: true`.
 */

import { PaymentSuccesfull } from '@final/shared'
import { CreatePayment, GetPayment, GetManyPayment, GetManyPaymentByMonth, ApiErr } from '@final/shared'
import { paymentModel } from './payment.model.js'
import prisma from '@final/db'
import { billService } from '../bill/bill.service.js'
import { appointmentService } from '../appointment/appointment.service.js'
import { withCircuitBreaker } from '../../lib/circuitBreaker.js'
import { enqueueWrite } from '../../lib/writeQueue.js'

export const paymentService = {
  /*********
  |   READ  |
   *********/
  get: async (filters: GetPayment) => {
    return await withCircuitBreaker(() => paymentModel.get(filters))
  },

  getMany: async (filters: GetManyPayment) => {
    return await withCircuitBreaker(() => paymentModel.getMany(filters))
  },

  getManyByMonth: async (filters: GetManyPaymentByMonth) => {
    return await withCircuitBreaker(() => paymentModel.getManyByMonth(filters))
  },

  /***********
  |   CREATE  |
   ***********/
  create: async (data: CreatePayment): Promise<PaymentSuccesfull | { queued: true; message: string; bill_id: number }> => {
    try {
      return await withCircuitBreaker(async () => {
        return await prisma.$transaction(async (tx) => {
          /********************
          |   OBTENER FACTURA  |
           ********************/
          const bill = await billService.get({ bill_id: data.bill_id })
          if (!bill) {
            throw { name: 'UnexistBill', statusCode: 404, message: 'La factura no existe' } as ApiErr
          }

          const billFinance = await billService.getTotal(data.bill_id)
          if (billFinance.debt === 0) {
            throw { name: 'BillIsPaid', statusCode: 400, message: 'La factura ya fue pagada.' } as ApiErr
          }

          /*******************************
          |   INICIO DEL PROCESO DE PAGO  |
           *******************************/
          if (bill.appointment_id) {
            await appointmentService.updateStatus(bill.appointment_id, 'completed', tx)
          }

          /****************
          |   PAGO EXACTO  |
           ****************/
          if (data.amount === billFinance.debt) {
            const payment = await paymentModel.create(data, tx)
            await billService.updateState({ bill_id: data.bill_id, status: 'paid' }, tx)
            return {
              bill_id: data.bill_id,
              cashier_id: data.cashier_id,
              amount_paid: data.amount,
              method: data.method,
              payment_id: payment?.payment_id,
              devolution: 0,
              debt: 0,
            } as PaymentSuccesfull
          }

          /******************
          |   PAGO DE ABONO  |
           ******************/
          if (data.amount < billFinance.debt) {
            const payment = await paymentModel.create(data, tx)
            await billService.updateState({ bill_id: data.bill_id, status: 'partially' }, tx)
            return {
              bill_id: data.bill_id,
              cashier_id: data.cashier_id,
              amount_paid: data.amount,
              method: data.method,
              payment_id: payment?.payment_id,
              devolution: 0,
              debt: billFinance.debt - data.amount,
            } as PaymentSuccesfull
          }

          /***************
          |   SOBRE PAGO  |
           ***************/
          const payment = await paymentModel.create(data, tx)
          await billService.updateState({ bill_id: data.bill_id, status: 'paid' }, tx)
          return {
            bill_id: data.bill_id,
            cashier_id: data.cashier_id,
            amount_paid: data.amount,
            method: data.method,
            payment_id: payment?.payment_id,
            devolution: data.amount - billFinance.debt,
            debt: 0,
          } as PaymentSuccesfull
        })
      })
    } catch (err: any) {
      // Solo encolamos si es fallo de infraestructura (503)
      if (err?.statusCode === 503) {
        await enqueueWrite('payment', 'create', data as unknown as Record<string, unknown>)
        return {
          queued: true,
          bill_id: data.bill_id,
          message: 'Pago registrado localmente. Se procesará cuando el servidor esté disponible.',
        }
      }
      throw err
    }
  },
}
