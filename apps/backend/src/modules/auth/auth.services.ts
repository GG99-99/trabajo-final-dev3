import 'dotenv/config'
import bcrypt from 'bcrypt'
import { ApiErr, LoginData, CreatePerson, UserCredentials, CashierJwtPayload } from '@final/shared'
import { authModel } from './auth.model.js'
import { personService } from '../person/person.service.js'
import jwt from 'jsonwebtoken'
import { refreshIfExpired, registerTokens } from '#backend/utils'

export const authService = {
    login: async (userData: LoginData): Promise<UserCredentials> => {

        // buscar usuarios
        const user = await personService.get({email: userData.email, noPass: false})
        if(!user) throw({statusCode: 401, name: 'InvalidCredentials', message: 'credenciales invalidas'} as ApiErr)

        // validar clave
        const validPassword = await bcrypt.compare(userData.password, user.password!)
        if(!validPassword) throw({statusCode: 401, name: 'InvalidCredentials', message: 'credenciales invalidas'} as ApiErr)


        return {
            email: user.email,
            person_id: user.person_id,
            type: user.type,
            tag: user.tag ?? null,
        }
    },

    register: async (data: CreatePerson) => {
        
        if(data.type === "client") throw({});
        
        
        refreshIfExpired('tokenWorker')
        refreshIfExpired('tokenCashier')

        if(data.type === "worker" && data.token === registerTokens.tokenWorker.value){
            return await personService.create(data)
        }
        else if(data.type === "cashier" && data.token === registerTokens.tokenCashier.value){
            return await personService.create(data)
        }

        throw({name: "InvalidRegister", statusCode: 403, message: "registro invalido"} as ApiErr)
        
    },

    createToken: (data: UserCredentials): string =>
        jwt.sign(data, process.env.SECRET_JWT_KEY!, { expiresIn: '1h' }),

    loginCashier: async (userData: LoginData): Promise<CashierJwtPayload> => {
        const user = await personService.get({ email: userData.email, noPass: false })
        if (!user) {
            throw {
                statusCode: 401,
                name: 'InvalidCredentials',
                message: 'Credenciales inválidas',
            } as ApiErr
        }

        if (user.type !== 'cashier') {
            throw {
                statusCode: 403,
                name: 'NotCashier',
                message: 'Esta cuenta no es de tipo cajero',
            } as ApiErr
        }

        const validPassword = await bcrypt.compare(userData.password, user.password!)
        if (!validPassword) {
            throw {
                statusCode: 401,
                name: 'InvalidCredentials',
                message: 'Credenciales inválidas',
            } as ApiErr
        }

        const cashier = await authModel.getCashierByPersonId(user.person_id)
        if (!cashier) {
            throw {
                statusCode: 403,
                name: 'CashierRecordMissing',
                message: 'No existe registro de cajero para esta persona',
            } as ApiErr
        }

        return {
            email: user.email,
            person_id: user.person_id,
            type: 'cashier',
            cashier_id: cashier.cashier_id,
            tag: user.tag ?? null,
        }
    },

    createCashierToken: (data: CashierJwtPayload): string =>
        jwt.sign(data, process.env.SECRET_JWT_KEY!, { expiresIn: '24h' }),
}