import 'dotenv/config';
export declare const s3Service: {
    upload: (buffer: Buffer, mimeType: string, folder?: string) => Promise<{
        key: string;
        url: string;
    }>;
    delete: (key: string) => Promise<void>;
    presign: (key: string, expiresIn?: number) => Promise<string>;
};
//# sourceMappingURL=s3.d.ts.map