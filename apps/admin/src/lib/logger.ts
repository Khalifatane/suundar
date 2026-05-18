export const logger = {
  info: (...args: unknown[]) => console.info("[dashboard]", ...args),
  warn: (...args: unknown[]) => console.warn("[dashboard]", ...args),
  error: (...args: unknown[]) => console.error("[dashboard]", ...args),
};
