import { Request, Response} from 'express';
import { authService } from "./auth.services.js"
import { UserCredentials, ApiResponse } from '@final/shared';

export const authController = {
    login: async (req: Request, res: Response) => {
        const dataLogin = req.body
        const userCredentials: UserCredentials = await authService.login(dataLogin)
        const token = authService.createToken(userCredentials)

        res.cookie("jwt_token", token, {
            httpOnly: true, // con esto la cookie solo sera accesible desde el servidor
            secure: process.env.NODE_ENV === "production", // para que solo funcione con https
            sameSite: "lax", // el token solo se puede acceder en el mismo dominio
            maxAge: 1000 * 60 * 60,
          });

        const response: ApiResponse<UserCredentials> = { ok: true, data: userCredentials, error: null };
        return res.json(response)
        
    },
    
    register: async (req: Request, res: Response) => {
    }


}