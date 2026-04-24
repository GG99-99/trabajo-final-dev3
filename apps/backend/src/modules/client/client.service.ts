/**
 * client.service.ts — con resiliencia Redis
 * Circuit breaker + cache media (5 min) para lecturas.
 * Sin write-queue (registro de clientes no es crítico offline).
 */

import { ClientCreate, ApiErr, ClientPublic, ClientWithRelations } from '@final/shared'
import { clientModel } from './client.model.js'
import { personService } from '../person/person.service.js'
import { clienUtils } from './client.utils.js'
import { withCircuitBreaker } from '../../lib/circuitBreaker.js'
import { withCache, invalidateCache, CK, TTL } from '../../lib/cache.js'

export const clientService = {
  get: async (client_id: number) => {
    const key = CK.CLIENT(client_id)
    return await withCache(key, TTL.MEDIUM, () =>
      withCircuitBreaker(() => clientModel.get(client_id))
    )
  },

  getByEmail: async (email: string) => {
    return await withCircuitBreaker(async () => {
      const client = await clientModel.getByEmail(email)
      if (!client) return null
      return clienUtils.clientToPublic(client)
    })
  },

  getMany: async () => {
    const key = CK.CLIENTS()
    return await withCache(key, TTL.MEDIUM, () =>
      withCircuitBreaker(async () => {
        const clients: ClientWithRelations[] = await clientModel.getMany()
        if (clients.length === 0) return []
        const publicClients: ClientPublic[] = []
        for (const c of clients) publicClients.push(clienUtils.clientToPublic(c))
        return publicClients
      })
    )
  },

  create: async (data: ClientCreate) => {
    const result = await withCircuitBreaker(async () => {
      data.password = ''
      const existing = await personService.get({ email: data.email, noPass: true })
      if (existing) {
        throw { statusCode: 409, name: 'EmailExists', message: 'Email already exists' } as ApiErr
      }
      return personService.create(data)
    })
    await invalidateCache(CK.CLIENTS())
    return result
  },
}
