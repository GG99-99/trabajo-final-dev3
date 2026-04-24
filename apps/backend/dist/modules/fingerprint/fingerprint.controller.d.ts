import { Request, Response } from "express";
export declare const fingerprintController: {
    get: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    getAll: (_req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    getMissingWorkers: (_req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    upsert: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    delete: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
};
//# sourceMappingURL=fingerprint.controller.d.ts.map