import { NextFunction, Request, Response } from "express";
import { ApiResponse, ApiErr } from "@final/shared";

interface backendErr extends ApiErr {
  [key: string]: any;
}

export function errorHandler(err: backendErr, req: Request, res: Response, next: NextFunction) {
    const statusCode = err.statusCode || 500

    const response: ApiResponse<void> = {
        ok: false,
        data: null,
        error: {
            name:       err.name    || 'InternalError',
            statusCode: statusCode,
            message:    err.message || 'An unexpected error occurred'
        }
    }

    return res.status(statusCode).json(response)
}