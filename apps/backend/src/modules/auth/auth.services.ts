import 'dotenv/config'
import  bcrypt  from 'bcrypt';
import { ApiErr, LoginData, CreatePerson, UserCredentials } from '@final/shared';
// import { authModel } from "./auth.model.js"
import { personService } from '../person/person.service.js';
import jwt from 'jsonwebtoken';
import { refreshIfExpired, registerTokens } from '#backend/utils';

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
            type: user.type
        }
    },

    register: async (data: CreatePerson) => {
        
        if(data.type === "client") return await personService.create(data);
        
        
        refreshIfExpired('tokenCashier')
        refreshIfExpired('tokenCashier')

        if(data.type === "worker" && data.token === registerTokens.tokenWorker.value){
            return await personService.create(data)
        }
        else if(data.type === "cashier" && data.token === registerTokens.tokenCashier.value){
            return await personService.create(data)
        }

        throw({name: "InvalidRegister", statusCode: 403, message: "registro invalido"} as ApiErr)
        
    },

    createToken: (data: UserCredentials): string => (jwt.sign(data, process.env.SECRET_JWT_KEY!, {expiresIn: "1h"}) )

}