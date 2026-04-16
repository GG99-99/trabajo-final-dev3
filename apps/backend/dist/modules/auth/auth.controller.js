import { authService } from "./auth.services.js";
export const authController = {
    login: async (req, res) => {
        /*********************************************
        |   OBTENER DATA PARA EL LOGIN DE LA REQUEST  |
         *********************************************/
        const dataLogin = req.body;
        /****************************************************
        |   LOGEAR AL USUARIO Y OBTENER LAS USERCREDENTIALS  |
         ****************************************************/
        const userCredentials = await authService.login(dataLogin);
        /********************
        |   CREAR JWT TOKEN  |
         ********************/
        const token = authService.createToken(userCredentials);
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
        const response = { ok: true, data: userCredentials, error: null };
        /*************************************
        |   ENVIAR RESPUESTA EN FORMATO JSON  |
         *************************************/
        return res.json(response);
    },
    register: async (req, res) => {
        /***********************************
        |   OBTENER DATA  DEL REQUEST BODY  |
         ***********************************/
        const personData = req.body;
        /********************
        |   CREAR RESPUESTA  |
         ********************/
        const response = {
            ok: true,
            data: true,
            error: null
        };
        /*************************************
        |   ENVIAR RESPUESTA EN FORMATO JSON  |
         *************************************/
        return res.json(response);
    }
};
//# sourceMappingURL=auth.controller.js.map