import { Request, Response } from 'express';
export declare const publicController: {
    /** GET /api/public/tattoos */
    getTattoos: (_req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    /** GET /api/public/workers */
    getWorkers: (_req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    /** POST /api/public/send-code — send 6-digit OTP to email */
    sendCode: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    /** POST /api/public/verify-code — verify the OTP */
    verifyCode: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    /** GET /api/public/check-email?email= — check if email is already a client */
    checkEmail: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    /** GET /api/public/blocks?worker_id=&date= */
    getBlocks: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    /** POST /api/public/book — rate-limited + IP daily guard */
    book: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
};
//# sourceMappingURL=public.controller.d.ts.map