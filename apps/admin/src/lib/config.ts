export const appConfig = {
  appName: "Dashboard Hybrid Admin",
  runtime: {
    htmlDrivenEntry: "src/main.jsx",
    spaEntry: "src/main.tsx",
  },
};

export function getEnv(name: string, fallback = "") {
  return (import.meta.env as Record<string, string | undefined>)[name] ?? fallback;
}
