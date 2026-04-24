import jwt from 'jsonwebtoken';
export function validateCashierJwtMiddleware(req, res, next) {
    const token = req.cookies?.cashier_jwt;
    if (!token) {
        return res.status(401).json({
            ok: false,
            data: null,
            error: {
                name: 'Unauthorized',
                statusCode: 401,
                message: 'Sesión de cajero no encontrada.',
            },
        });
    }
    try {
        const decoded = jwt.verify(token, process.env.SECRET_JWT_KEY);
        if (decoded.type !== 'cashier' || typeof decoded.cashier_id !== 'number') {
            throw new Error('invalid payload');
        }
        ;
        req.user = decoded;
        return next();
    }
    catch {
        return res.status(401).json({
            ok: false,
            data: null,
            error: {
                name: 'InvalidToken',
                statusCode: 401,
                message: 'Token de cajero inválido o expirado.',
            },
        });
    }
}
//# sourceMappingURL=validateCashierJwt.middleware.js.map