import { decodeJwt } from "#backend/utils";
import { Request, Response, NextFunction } from "express";

export function validateJwtMiddleware(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.jwt_token;
    
    if (!token) {
        return res.status(401).json({ 
            ok: false, 
            data: null ,
            error: {
                name: "InvalidToken", 
                statusCode: 403, 
                message: "token invalido"
            } });
    }
    
    try {
        const decoded = decodeJwt(token);
        (req as any).user = decoded;
        next();

        
    } catch (e) {


        return res.status(401).json({ 
            ok: false, 
            data: null ,
            error: {
                name: "InvalidToken", 
                statusCode: 403, 
                message: "token invalido"
            } });
    }
}