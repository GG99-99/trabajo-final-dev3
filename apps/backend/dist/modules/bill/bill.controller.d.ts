import { Request, Response } from "express";
export declare const billController: {
    getMany: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    get: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    getTotal: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    getStockMovements: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    getTattoos: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    create: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    updateState: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
};
//# sourceMappingURL=bill.controller.d.ts.map