// src/logger/types.ts
export type LogLevel = 'error' | 'warn' | 'info' | 'http' | 'debug';

export interface LoggerConfig {
  level: LogLevel;
  serviceName: string;
  logDir?: string;
}

export interface LogMeta {
  [key: string]: unknown;
}