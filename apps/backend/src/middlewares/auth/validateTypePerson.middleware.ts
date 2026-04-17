import { PersonType } from "@final/db";
import { UserCredentials } from "@final/shared";
import { Request, Response, NextFunction } from "express";


export function valiateTypePerson(typePerson: PersonType){

    return (req: any, res: Response, next: NextFunction) => {

        const user: UserCredentials = req.user
        if(!user || user.type != typePerson) {
            res.status(403).json({
                ok: false,
                data: null,
                error: {
                    name: "Forbidden",
                    statusCode: 403,
                    message: "no tienes permiso"
                }
            })
        }

        next()
}}