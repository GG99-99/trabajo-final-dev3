import { Request, Response } from "express";
export declare const paymentController: {
    get: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    getMany: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    getManyByMonth: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    create: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
};
//# sourceMappingURL=payment.controller.d.ts.map