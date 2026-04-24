import { Request, Response } from "express";
export declare const imgController: {
    getMany: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    get: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    /**
     * GET /api/imgs/raw/:img_id
     * Serves the image: redirects to S3 URL if available, otherwise streams blob.
     */
    getRaw: (req: Request, res: Response) => Promise<void | Response<any, Record<string, any>>>;
    /**
     * POST /api/imgs — upload image to S3, store key+url in DB
     */
    create: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
};
//# sourceMappingURL=img.controller.d.ts.map