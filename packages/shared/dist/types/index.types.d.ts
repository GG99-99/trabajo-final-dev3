export * from './auth/auth.types.js';
export * from './users/users.type.js';
export * from './person/person.type.js';
export * from './schedules/schedules.type.js';
export * from './appointment/appointment.types.js';
export * from './worker/worker.types.js';
export * from './client/client.types.js';
export * from './cashier/cashier.types.js';
/******************
|   GENERAL TYPES  |
 ******************/
export type Override<T, U extends Partial<Record<keyof T, unknown>>> = Omit<T, keyof U> & U;
//# sourceMappingURL=index.types.d.ts.map