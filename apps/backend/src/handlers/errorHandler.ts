import { NextFunction, Request, Response } from "express";
import { ApiResponse, ApiErr } from "@final/shared";

interface backendErr extends ApiErr  {
  
  [key: string]: any;
}

export function errorHandler(err: backendErr, req: Request, res: Response, next: NextFunction){

    const response: ApiResponse<void> = {
        ok: false,
        data: null,
        error: {
          name: err.name,
          statusCode: err.statusCode,
          message: err.message
        }

      }
    return res.json(response);

}