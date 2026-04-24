import jwt from 'jsonwebtoken';
import { decodeJwt } from '#backend/utils';
function verifyMainJwtCookie(token) {
    try {
        return decodeJwt(token);
    }
    catch {
        return null;
    }
}
function verifyCashierJwtCookie(token) {
    try {
        const decoded = jwt.verify(token, process.env.SECRET_JWT_KEY);
        if (decoded.type !== 'cashier' || typeof decoded.cashier_id !== 'number')
            return null;
        return decoded;
    }
    catch {
        return null;
    }
}
/**
 * Acepta sesión vía cookie `jwt_token` (persona) o `cashier_jwt` (checkout cajero).
 */
export function validateJwtOrCashierMiddleware(req, res, next) {
    const cashierToken = req.cookies?.cashier_jwt;
    const mainToken = req.cookies?.jwt_token;
    if (cashierToken) {
        const c = verifyCashierJwtCookie(cashierToken);
        if (c) {
            ;
            req.user = c;
            return next();
        }
    }
    if (mainToken) {
        const u = verifyMainJwtCookie(mainToken);
        if (u) {
            ;
            req.user = u;
            return next();
        }
    }
    return res.status(401).json({
        ok: false,
        data: null,
        error: {
            name: 'Unauthorized',
            statusCode: 401,
            message: 'Se requiere iniciar sesión (cajero o usuario).',
        },
    });
}
//# sourceMappingURL=validateJwtOrCashier.middleware.js.map