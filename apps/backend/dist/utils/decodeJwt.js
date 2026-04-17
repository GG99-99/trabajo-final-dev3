import "dotenv/config";
import jwt from "jsonwebtoken";
export function decodeJwt(token) {
    try {
        const decode = jwt.verify(token, process.env.SECRET_JWT_KEY);
        return decode;
    }
    catch (e) {
        throw {
            error: {
                name: "InvalidToken",
                message: "token invalido",
                statusCode: 403
            },
            ok: false,
            data: null
        };
    }
}
//# sourceMappingURL=decodeJwt.js.map