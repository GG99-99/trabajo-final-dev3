// import { UserPublic } from '@forms/shared';
import "dotenv/config";
import jwt from "jsonwebtoken";
export function decodeJwt(token) {
    const decode = jwt.verify(token, process.env.SECRET_JWT_KEY);
    return decode;
}
//# sourceMappingURL=decodeJwt.js.map