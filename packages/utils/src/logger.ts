import type { Logger } from '@siggistore/shared-types';

export const consoleLogger: Logger = {
  error: (message: string, meta?: any) => console.error(`[ERROR] ${message}`, meta ?? ''),
  warn: (message: string, meta?: any) => console.warn(`[WARN] ${message}`, meta ?? ''),
  info: (message: string, meta?: any) => console.info(`[INFO] ${message}`, meta ?? ''),
  debug: (message: string, meta?: any) => console.debug(`[DEBUG] ${message}`, meta ?? ''),
};

export function createLogger(prefix: string): Logger {
  return {
    error: (message: string, meta?: any) => console.error(`[${prefix}] [ERROR] ${message}`, meta ?? ''),
    warn: (message: string, meta?: any) => console.warn(`[${prefix}] [WARN] ${message}`, meta ?? ''),
    info: (message: string, meta?: any) => console.info(`[${prefix}] [INFO] ${message}`, meta ?? ''),
    debug: (message: string, meta?: any) => console.debug(`[${prefix}] [DEBUG] ${message}`, meta ?? ''),
  };
}
