import { Request, Response, NextFunction } from "express";
import { isExpired, registerTokens } from "#backend/utils";


export function validateRegisterToken(req: Request, res: Response, next: NextFunction) {
  const token = req.headers["x-registration-token"] as string;
 
  if (!token) {
    res.status(401).json({ error: "Token requerido" });
    return;
  }
 
  const isValid =
    (!isExpired(registerTokens.tokenA.expiresAt) && token === registerTokens.tokenA.value) ||
    (!isExpired(registerTokens.tokenB.expiresAt) && token === registerTokens.tokenB.value);
 
  if (!isValid) {
    res.status(401).json({ error: "Token inválido o expirado" });
    return;
  }
 
  next();
}







export function requireRegisterToken(req: Request, res: Response, next: NextFunction) {
  const token = req.headers["x-registration-token"] as string;
 
  if (!token) {
    res.status(401).json({ error: "Token requerido" });
    return;
  }
 
  const isValid =
    (!isExpired(registerTokens.tokenA.expiresAt) && token === registerTokens.tokenA.value) ||
    (!isExpired(registerTokens.tokenB.expiresAt) && token === registerTokens.tokenB.value);
 
  if (!isValid) {
    res.status(401).json({ error: "Token inválido o expirado" });
    return;
  }
 
  next();
}