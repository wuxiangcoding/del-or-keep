import { createHash } from "node:crypto";
import { execFile } from "node:child_process";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { basename, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const distDir = resolve(rootDir, "extension/dist");
const releasesDir = resolve(rootDir, "releases");

await import("./build-extension.mjs");

const manifest = JSON.parse(await readFile(resolve(distDir, "manifest.json"), "utf8"));
const archiveName = `del-or-keep-${manifest.version}.zip`;
const archivePath = resolve(releasesDir, archiveName);
const checksumPath = `${archivePath}.sha256`;

await mkdir(releasesDir, { recursive: true });
await rm(archivePath, { force: true });
await rm(checksumPath, { force: true });

try {
  await execFileAsync("zip", ["-X", "-q", "-r", archivePath, "."], {
    cwd: distDir,
    env: {
      ...process.env,
      COPYFILE_DISABLE: "1"
    }
  });
} catch (error) {
  throw new Error(`Unable to create ${archiveName}. Install the zip CLI and run pnpm extension:package again.`, {
    cause: error
  });
}

const archiveBuffer = await readFile(archivePath);
const checksum = createHash("sha256").update(archiveBuffer).digest("hex");

await writeFile(checksumPath, `${checksum}  ${basename(archivePath)}\n`);

console.log(`Packaged ${archivePath}`);
console.log(`SHA-256 ${checksum}`);
