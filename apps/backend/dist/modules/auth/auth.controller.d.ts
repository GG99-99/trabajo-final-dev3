import { Request, Response } from 'express';
export declare const authController: {
    login: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    register: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    validateToken: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    getRegisterToken: (req: Request, res: Response) => Promise<void>;
    /**
     * POST /api/auth/admin/tokens
     * Solo accesible para usuarios con tag === 'admin'.
     * Devuelve los tokens actuales (worker y cashier), regenerándolos si expiraron.
     */
    getAdminTokens: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    /**
     * POST /api/auth/admin/tokens/refresh
     * Fuerza la regeneración de ambos tokens (aunque no hayan expirado).
     */
    refreshAdminTokens: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    loginCashier: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    logoutCashier: (_req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    meCashier: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
};
//# sourceMappingURL=auth.controller.d.ts.map