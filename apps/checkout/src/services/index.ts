import * as billService from './billService'
import * as paymentService from './paymentService'
import * as workerService from './workerService'
import * as appointmentService from './appointmentService'
import * as clientService from './clientService'
import * as productVariantService from './productVariantService'
import * as tattooService from './tattooService'
import * as authService from './authService'
import * as cashRegisterService from './cashRegisterService'

export const checkoutService = {
  ...billService,
  ...paymentService,
  ...workerService,
  ...appointmentService,
  ...clientService,
  ...productVariantService,
  ...tattooService,
  ...authService,
  ...cashRegisterService,
}

// Re-exportar todas las funciones directamente
export * from './billService'
export * from './paymentService'
export * from './workerService'
export * from './appointmentService'
export * from './clientService'
export * from './productVariantService'
export * from './tattooService'
export * from './healthService'
export * from './authService'
export * from './cashRegisterService'
