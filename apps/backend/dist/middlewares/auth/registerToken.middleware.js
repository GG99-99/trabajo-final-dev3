import { isExpired, registerTokens } from "#backend/utils";
export function validateRegisterToken(req, res, next) {
    const token = req.headers["x-registration-token"];
    if (!token) {
        res.status(401).json({ error: "Token requerido" });
        return;
    }
    const isValid = (!isExpired(registerTokens.tokenWorker.expiresAt) && token === registerTokens.tokenWorker.value) ||
        (!isExpired(registerTokens.tokenCashier.expiresAt) && token === registerTokens.tokenCashier.value);
    if (!isValid) {
        res.status(401).json({ error: "Token inválido o expirado" });
        return;
    }
    next();
}
export function requireRegisterToken(req, res, next) {
    const token = req.headers["x-registration-token"];
    if (!token) {
        res.status(401).json({ error: "Token requerido" });
        return;
    }
    const isValid = (!isExpired(registerTokens.tokenWorker.expiresAt) && token === registerTokens.tokenWorker.value) ||
        (!isExpired(registerTokens.tokenCashier.expiresAt) && token === registerTokens.tokenCashier.value);
    if (!isValid) {
        res.status(401).json({ error: "Token inválido o expirado" });
        return;
    }
    next();
}
//# sourceMappingURL=registerToken.middleware.js.map