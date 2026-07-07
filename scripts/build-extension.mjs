import { cp, rm } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sourceDir = resolve(rootDir, "extension/src");
const outputDir = resolve(rootDir, "extension/dist");

await rm(outputDir, { recursive: true, force: true });
await cp(sourceDir, outputDir, { recursive: true });

console.log(`Built extension at ${outputDir}`);
