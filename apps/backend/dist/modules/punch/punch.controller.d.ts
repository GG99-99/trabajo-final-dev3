import { Request, Response } from "express";
export declare const punchController: {
    clockIn: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    clockOut: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    getTodayStatus: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    getHistory: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
};
//# sourceMappingURL=punch.controller.d.ts.map