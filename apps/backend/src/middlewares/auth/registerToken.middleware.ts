import { Request, Response, NextFunction } from "express";
import { isExpired, refreshIfExpired, registerTokens } from "#backend/utils";
import type { ApiErr } from "@final/shared";


export function validateRegisterToken(req: Request, res: Response, next: NextFunction) {
  const token = req.headers["x-registration-token"] as string;

  if (!token) {
    res.status(401).json({ ok: false, data: null, error: { name: "TokenRequired", statusCode: 401, message: "Token de registro requerido" } });
    return;
  }

  refreshIfExpired("tokenWorker");
  refreshIfExpired("tokenCashier");

  const isValid =
    (!isExpired(registerTokens.tokenWorker.expiresAt) && token === registerTokens.tokenWorker.value) ||
    (!isExpired(registerTokens.tokenCashier.expiresAt) && token === registerTokens.tokenCashier.value);

  if (!isValid) {
    res.status(401).json({ ok: false, data: null, error: { name: "InvalidToken", statusCode: 401, message: "Token inválido o expirado" } });
    return;
  }

  next();
}


export function requireRegisterToken(req: Request, res: Response, next: NextFunction) {
  const token = req.headers["x-registration-token"] as string;
  const role  = req.body?.type as string | undefined;

  if (!token) {
    res.status(401).json({ ok: false, data: null, error: { name: "TokenRequired", statusCode: 401, message: "Token de registro requerido" } });
    return;
  }

  refreshIfExpired("tokenWorker");
  refreshIfExpired("tokenCashier");

  // Validate token is not expired and matches the expected role
  const workerTokenValid  = !isExpired(registerTokens.tokenWorker.expiresAt)  && token === registerTokens.tokenWorker.value;
  const cashierTokenValid = !isExpired(registerTokens.tokenCashier.expiresAt) && token === registerTokens.tokenCashier.value;

  if (!workerTokenValid && !cashierTokenValid) {
    res.status(401).json({ ok: false, data: null, error: { name: "InvalidToken", statusCode: 401, message: "Token inválido o expirado" } });
    return;
  }

  // Cross-role validation: token must match the role being registered
  if (role === "worker" && !workerTokenValid) {
    res.status(403).json({ ok: false, data: null, error: { name: "TokenRoleMismatch", statusCode: 403, message: "Este token no corresponde al rol Artist. Usa el token correcto." } });
    return;
  }

  if (role === "cashier" && !cashierTokenValid) {
    res.status(403).json({ ok: false, data: null, error: { name: "TokenRoleMismatch", statusCode: 403, message: "Este token no corresponde al rol Cashier. Usa el token correcto." } });
    return;
  }

  next();
}