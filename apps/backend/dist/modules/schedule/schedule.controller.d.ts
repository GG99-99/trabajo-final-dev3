import { Request, Response } from "express";
export declare const scheduleController: {
    getMany: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    getActive: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    getDayByWorker: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    create: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    inactive: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
};
//# sourceMappingURL=schedule.controller.d.ts.map