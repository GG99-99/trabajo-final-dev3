/**
 * person.service.ts — con resiliencia Redis
 * Circuit breaker en todas las operaciones.
 * Cache corta (1 min) para get individual.
 * Invalida cache en update / create / delete.
 */

import bcrypt from 'bcrypt'
import { personModel } from './person.model.js'
import { ApiErr, CreatePerson, GetPerson } from '@final/shared'
import { withCircuitBreaker } from '../../lib/circuitBreaker.js'
import { withCache, invalidateCache, CK, TTL } from '../../lib/cache.js'

export const personService = {
  /*********
  |   READ  |
   *********/
  get: async (filters: GetPerson) => {
    if (filters.person_id) {
      const key = `person:${filters.person_id}`
      return await withCache(key, TTL.SHORT, () =>
        withCircuitBreaker(() =>
          personModel.get({ person_id: filters.person_id, email: filters.email, noPass: filters.noPass })
        )
      )
    }
    return await withCircuitBreaker(() =>
      personModel.get({ person_id: filters.person_id, email: filters.email, noPass: filters.noPass })
    )
  },

  getMany: async () => {
    return await withCircuitBreaker(() => personModel.getMany())
  },

  /***********
  |   UPDATE  |
   ***********/
  update: async (person_id: number, data: {
    first_name?: string
    last_name?: string
    email?: string
    password?: string
    specialty?: string
    medical_notes?: string
  }) => {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10)
    } else {
      delete data.password
    }
    const result = await withCircuitBreaker(() => personModel.update(person_id, data))
    await invalidateCache(`person:${person_id}`)
    return result
  },

  /***********
  |   DELETE  |
   ***********/
  softDelete: async (person_id: number) => {
    const result = await withCircuitBreaker(() => personModel.softDelete(person_id))
    await invalidateCache(`person:${person_id}`)
    return result
  },

  ban: async (person_id: number, banned: boolean) => {
    const result = await withCircuitBreaker(() => personModel.ban(person_id, banned))
    await invalidateCache(`person:${person_id}`)
    return result
  },

  /***********
  |   CREATE  |
   ***********/
  create: async (personData: CreatePerson) => {
    return await withCircuitBreaker(async () => {
      const existing = await personModel.getDeleted(personData.email)
      if (existing) {
        const hashPassword = personData.password
          ? await bcrypt.hash(personData.password, 10)
          : existing.password ?? ''
        return await personModel.restore(existing.person_id, { ...personData, password: hashPassword })
      }

      const dup = await personModel.get({ email: personData.email, noPass: true })
      if (dup) {
        throw {
          statusCode: 409,
          name: 'EmailAlreadyExist',
          message: 'El correo electronico ya se encuetra en uso',
        } as ApiErr
      }

      const hashPassword = await bcrypt.hash(personData.password, 10)
      personData.password = hashPassword
      return await personModel.create(personData)
    })
  },
}

