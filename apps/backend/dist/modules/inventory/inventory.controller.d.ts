import { Request, Response } from "express";
export declare const inventoryController: {
    get: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    getTotalQuantity: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    getNotExpired: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    getManyNotExpired: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    create: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    updateQuantity: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
};
//# sourceMappingURL=inventory.controller.d.ts.map