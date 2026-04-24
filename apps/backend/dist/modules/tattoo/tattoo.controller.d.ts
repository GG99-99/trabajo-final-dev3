import { Request, Response } from "express";
export declare const tattooController: {
    get: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    getMany: (_req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    getMaterials: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    create: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    /** POST /api/tattoos/with-image — multipart: image file + JSON fields */
    createWithImage: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    /** PATCH /api/tattoos/:tattoo_id — update fields and optionally replace image */
    update: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
};
//# sourceMappingURL=tattoo.controller.d.ts.map