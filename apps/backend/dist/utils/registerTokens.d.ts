export declare const registerTokens: {
    tokenWorker: {
        value: string;
        expiresAt: number;
    };
    tokenCashier: {
        value: string;
        expiresAt: number;
    };
};
export declare function generateToken(length: number): string;
export declare function isExpired(expiresAt: number): boolean;
export declare function refreshIfExpired(key: keyof typeof registerTokens): void;
export declare function printRegisterTokens(): void;
//# sourceMappingURL=registerTokens.d.ts.map