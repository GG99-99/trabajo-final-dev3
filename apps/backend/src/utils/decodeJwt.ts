import { ok } from 'node:assert';
// import { UserPublic } from '@forms/shared';
import { ApiErr, ApiResponse, UserCredentials } from "@final/shared";
import "dotenv/config";
import jwt from "jsonwebtoken";


export function  decodeJwt(token: string){
     try{
          const decode =  jwt.verify(token, process.env.SECRET_JWT_KEY!);
          return decode as UserCredentials
     }catch (e) {
          throw({
               error: {
                    name: "InvalidToken", 
                    message: "token invalido", 
                    statusCode: 403
               } as ApiErr,
               ok: false,
               data: null
           } as ApiResponse<null>)
     }
     
}