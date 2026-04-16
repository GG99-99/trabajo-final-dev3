

 import { PrismaClient } from '@final/db';

// El tipo que acepta tanto el cliente normal como uno de transacción
export type PrismaTransactionClient = Omit<
  PrismaClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>;