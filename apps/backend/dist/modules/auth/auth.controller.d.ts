import { Request, Response } from 'express';
export declare const authController: {
    login: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    register: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    validateToken: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    getRegisterToken: (req: Request, res: Response) => Promise<void>;
};
//# sourceMappingURL=auth.controller.d.ts.map