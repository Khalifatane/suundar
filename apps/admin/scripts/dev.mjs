import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const server = await createServer({
  configFile: fileURLToPath(new URL("../vite.config.ts", import.meta.url)),
  mode: "admin",
});

await server.listen();

console.log();
console.log("  admin dev server ready");
console.log("  Local:   http://127.0.0.1:3000/admin/");
console.log();

const close = async () => {
  await server.close();
  process.exit(0);
};

process.on("SIGINT", close);
process.on("SIGTERM", close);
