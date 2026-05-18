import type { Logger } from '@siggistore/shared-types';

// Simple console-based logger
export const createLogger = (name: string): Logger => ({
  error: (message: string, meta?: any) => {
    console.error(`[${name}] ${message}`, meta);
  },
  warn: (message: string, meta?: any) => {
    console.warn(`[${name}] ${message}`, meta);
  },
  info: (message: string, meta?: any) => {
    console.info(`[${name}] ${message}`, meta);
  },
  debug: (message: string, meta?: any) => {
    console.debug(`[${name}] ${message}`, meta);
  },
});

// Default logger instance
export const logger = createLogger('storefront');
