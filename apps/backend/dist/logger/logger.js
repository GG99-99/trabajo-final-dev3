// src/logger/logger.ts
import winston, { format, transports } from 'winston';
import path from 'path';
const { combine, timestamp, printf, colorize, errors, json } = format;
// Formato para consola (desarrollo)
const consoleFormat = printf(({ level, message, timestamp, stack, ...meta }) => {
    const metaStr = Object.keys(meta).length ? `\n${JSON.stringify(meta, null, 2)}` : '';
    return `${timestamp} [${level}]: ${stack || message}${metaStr}`;
});
// Formato para archivos (producción)
const fileFormat = combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), errors({ stack: true }), json());
function createLogger(config) {
    const { level, serviceName, logDir = 'logs' } = config;
    return winston.createLogger({
        level,
        defaultMeta: { service: serviceName },
        format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), errors({ stack: true })),
        transports: [
            // Consola
            new transports.Console({
                format: combine(colorize({ all: true }), consoleFormat),
            }),
            // Todos los logs
            new transports.File({
                filename: path.join(logDir, 'app.log'),
                format: fileFormat,
                maxsize: 5 * 1024 * 1024, // 5MB
                maxFiles: 5,
            }),
            // Solo errores
            new transports.File({
                filename: path.join(logDir, 'error.log'),
                level: 'error',
                format: fileFormat,
                maxsize: 5 * 1024 * 1024,
                maxFiles: 5,
            }),
        ],
    });
}
// Instancia singleton
const logger = createLogger({
    level: process.env.LOG_LEVEL || 'info',
    serviceName: process.env.SERVICE_NAME || 'final-dev3/backend',
});
// Métodos tipados con meta opcional
export const log = {
    error: (message, meta) => logger.error(message, meta),
    warn: (message, meta) => logger.warn(message, meta),
    info: (message, meta) => logger.info(message, meta),
    http: (message, meta) => logger.http(message, meta),
    debug: (message, meta) => logger.debug(message, meta),
};
export default logger;
//# sourceMappingURL=logger.js.map