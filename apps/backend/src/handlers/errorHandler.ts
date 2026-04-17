import { NextFunction, Request, Response } from "express";
import { ApiResponse, ApiErr } from "@final/shared";

interface backendErr extends ApiErr {
  [key: string]: any;
}

export function errorHandler(err: backendErr, req: Request, res: Response, next: NextFunction) {
    const statusCode = err.statusCode || 500; // Usa 500 si no hay statusCode definido

    const response: ApiResponse<void> = {
        ok: false,
        data: null,
        error: {
            name: err.name,
            statusCode: statusCode,
            message: err.message
        }
    };

    return res.status(statusCode).json(response); // Establece el status code correctamente
}