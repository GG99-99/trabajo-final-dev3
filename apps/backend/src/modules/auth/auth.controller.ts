import { Request, Response} from 'express';
import { authService } from "./auth.services.js"
import { UserCredentials, ApiResponse, CreatePerson, LoginData, RegisterToken } from '@final/shared';
import { printRegisterTokens, refreshIfExpired, registerTokens  } from '#backend/utils';


export const authController = {
    login: async (req: Request, res: Response) => {

        /*********************************************
        |   OBTENER DATA PARA EL LOGIN DE LA REQUEST  |
         *********************************************/
        const dataLogin: LoginData = req.body

        /****************************************************
        |   LOGEAR AL USUARIO Y OBTENER LAS USERCREDENTIALS  |
         ****************************************************/
        const userCredentials: UserCredentials = await authService.login(dataLogin)

        /********************
        |   CREAR JWT TOKEN  |
         ********************/
        const token = authService.createToken(userCredentials)


        /*********************************************
        |   CREAR COOKIE QUE ALMACENARA EL TOKEN JWT  |
         *********************************************/
        res.cookie("jwt_token", token, {
            httpOnly: true, // con esto la cookie solo sera accesible desde el servidor
            secure: process.env.NODE_ENV === "production", // para que solo funcione con https
            sameSite: "lax", // el token solo se puede acceder en el mismo dominio
            maxAge: 1000 * 60 * 60,
          });

        
        /********************
        |   CREAR RESPUESTA  |
         ********************/
        const response: ApiResponse<UserCredentials> = { ok: true, data: userCredentials, error: null };

        /*************************************
        |   ENVIAR RESPUESTA EN FORMATO JSON  |
         *************************************/
        return res.json(response)
        
    },
    
    register: async (req: Request, res: Response) => {
        /***********************************
        |   OBTENER DATA  DEL REQUEST BODY  |
         ***********************************/
        const personData: CreatePerson = req.body


        /********************
        |   CREAR RESPUESTA  |
         ********************/
        const response: ApiResponse<boolean> = {
            ok: true,
            data: true,
            error: null
        }

        /*************************************
        |   ENVIAR RESPUESTA EN FORMATO JSON  |
         *************************************/
        return res.json(response)

    },
    getRegisterToken: async (req: Request, res: Response) => {
        refreshIfExpired("tokenA");
        refreshIfExpired("tokenB");
        
        printRegisterTokens()
        

        res.json({
            ok: true,
            data: {
                expiresAt: registerTokens.tokenA.expiresAt, // ambos expiran al mismo tiempo
            },
            error: null
        } as ApiResponse<RegisterToken>);
}


}