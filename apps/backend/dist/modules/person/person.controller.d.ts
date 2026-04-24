import { Request, Response } from "express";
export declare const personController: {
    get: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    getMany: (_req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    create: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    update: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    ban: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    softDelete: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
};
//# sourceMappingURL=person.controller.d.ts.map