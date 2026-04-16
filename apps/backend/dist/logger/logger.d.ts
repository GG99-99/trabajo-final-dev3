import winston from 'winston';
import { LogMeta } from './types.js';
declare const logger: winston.Logger;
export declare const log: {
    error: (message: string, meta?: LogMeta | Error) => winston.Logger;
    warn: (message: string, meta?: LogMeta) => winston.Logger;
    info: (message: string, meta?: LogMeta) => winston.Logger;
    http: (message: string, meta?: LogMeta) => winston.Logger;
    debug: (message: string, meta?: LogMeta) => winston.Logger;
};
export default logger;
//# sourceMappingURL=logger.d.ts.map