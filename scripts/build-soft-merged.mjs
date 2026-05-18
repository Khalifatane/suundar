import fs from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";

const repoRoot = process.cwd();
const storefrontDist = path.join(repoRoot, "apps", "storefront", "dist");
const adminDist = path.join(repoRoot, "apps", "admin", "dist");
const mergedDist = path.join(repoRoot, "dist");
const mergedAdminDist = path.join(mergedDist, "admin");

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: repoRoot,
      stdio: "inherit",
      shell: process.platform === "win32",
    });

    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${command} ${args.join(" ")} failed with exit code ${code ?? "unknown"}`));
    });
  });
}

async function resetDirectory(targetPath) {
  await fs.rm(targetPath, { recursive: true, force: true });
  await fs.mkdir(targetPath, { recursive: true });
}

async function copyDirectory(sourcePath, destinationPath) {
  await fs.mkdir(path.dirname(destinationPath), { recursive: true });
  await fs.cp(sourcePath, destinationPath, { recursive: true, force: true });
}

function rewriteAdminHtml(html) {
  return html
    .replace(/(["'(=])\/preline\.co\//g, "$1/admin/preline.co/")
    .replace(/(["'(=])\/fonts\.googleapis\.com\//g, "$1/admin/fonts.googleapis.com/")
    .replace(/(["'(=])\/fonts\.gstatic\.com\//g, "$1/admin/fonts.gstatic.com/")
    .replace(/(["'(=])\/cdn\.jsdelivr\.net\//g, "$1/admin/cdn.jsdelivr.net/")
    .replace(/(["'(=])\/www\.googletagmanager\.com\//g, "$1/admin/www.googletagmanager.com/")
    .replace(/(["'(=])\/js\//g, "$1/admin/js/")
    .replace(/(["'(=])\/css\//g, "$1/admin/css/")
    .replace(/(["'(=])\/images\//g, "$1/admin/images/")
    .replace(/(["'(=])\/pages\//g, "$1/admin/pages/")
    .replace(/=(["'])public\//g, '=$1/admin/')
    .replace(/\burl\((["']?)\/preline\.co\//g, "url($1/admin/preline.co/")
    .replace(/\burl\((["']?)\/fonts\.googleapis\.com\//g, "url($1/admin/fonts.googleapis.com/")
    .replace(/\burl\((["']?)\/fonts\.gstatic\.com\//g, "url($1/admin/fonts.gstatic.com/")
    .replace(/\burl\((["']?)\/cdn\.jsdelivr\.net\//g, "url($1/admin/cdn.jsdelivr.net/")
    .replace(/\burl\((["']?)\/www\.googletagmanager\.com\//g, "url($1/admin/www.googletagmanager.com/")
    .replace(/\burl\((["']?)\/js\//g, "url($1/admin/js/")
    .replace(/\burl\((["']?)\/css\//g, "url($1/admin/css/")
    .replace(/\burl\((["']?)\/images\//g, "url($1/admin/images/");
}

async function rewriteHtmlFiles(rootPath) {
  const entries = await fs.readdir(rootPath, { withFileTypes: true });

  await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(rootPath, entry.name);

      if (entry.isDirectory()) {
        await rewriteHtmlFiles(entryPath);
        return;
      }

      if (path.extname(entry.name).toLowerCase() !== ".html") {
        return;
      }

      const html = await fs.readFile(entryPath, "utf8");
      await fs.writeFile(entryPath, rewriteAdminHtml(html), "utf8");
    }),
  );
}

async function main() {
  await run("pnpm", ["--filter", "storefront", "build"]);
  await run("pnpm", ["--filter", "admin", "build"]);

  await resetDirectory(mergedDist);
  await copyDirectory(storefrontDist, mergedDist);
  await copyDirectory(adminDist, mergedAdminDist);
  await rewriteHtmlFiles(mergedAdminDist);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
