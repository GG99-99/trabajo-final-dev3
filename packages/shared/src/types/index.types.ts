export * from './auth/auth.types.js'
export * from './users/users.type.js'
export * from './person/person.type.js'
export * from './schedules/schedules.type.js'
export * from './appointment/appointment.types.js'
export * from './worker/worker.types.js'
export * from './client/client.types.js'
export * from './cashier/cashier.types.js'
export * from './category/category.types.js'
export * from './assists/assists.types.js'
export * from './attendance/attendance.types.js'
export * from './bill/bill.types.js'
export * from './img/img.types.js'
export * from './inventory/inventory.types.js'
export * from './noAssist/noAssist.types.js'
export * from './payment/payment.types.js'
export * from './provider/provider.types.js'
export * from './seat/seat.types.js'
export * from './stockMovement/stockMovement.types.js'
export * from './tatto/tattoo.type.js'
export * from './product/product.types.js'
export * from './audit/audit.types.js'


/******************
|   GENERAL TYPES  |
 ******************/
export type Override<T, U extends Partial<Record<keyof T, unknown>>> = Omit<T, keyof U> & U;
