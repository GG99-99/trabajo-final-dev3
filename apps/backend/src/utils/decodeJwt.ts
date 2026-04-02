// import { UserPublic } from '@forms/shared';
import "dotenv/config";
import jwt from "jsonwebtoken";


export function  decodeJwt(token: string){
     const decode =  jwt.verify(token, process.env.SECRET_JWT_KEY!);
     return decode
}