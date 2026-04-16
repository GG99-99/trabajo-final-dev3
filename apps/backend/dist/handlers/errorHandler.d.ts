import { NextFunction, Request, Response } from "express";
import { ApiErr } from "@final/shared";
interface backendErr extends ApiErr {
    [key: string]: any;
}
export declare function errorHandler(err: backendErr, req: Request, res: Response, next: NextFunction): Response<any, Record<string, any>>;
export {};
//# sourceMappingURL=errorHandler.d.ts.map