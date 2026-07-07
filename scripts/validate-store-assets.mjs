import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const requiredAssets = [
  ["extension/src/assets/icon-128.png", 128, 128],
  ["store/assets/screenshots/review-queue.png", 1280, 800],
  ["store/assets/screenshots/delete-confirmation.png", 1280, 800],
  ["store/assets/promotional/small-promo.png", 440, 280],
  ["store/assets/promotional/marquee-promo.png", 1400, 560]
];

function readPngDimensions(buffer) {
  const pngSignature = "89504e470d0a1a0a";

  if (buffer.subarray(0, 8).toString("hex") !== pngSignature) {
    throw new Error("not a PNG file");
  }

  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20)
  };
}

for (const [relativePath, expectedWidth, expectedHeight] of requiredAssets) {
  const filePath = resolve(rootDir, relativePath);
  const buffer = await readFile(filePath);
  const { width, height } = readPngDimensions(buffer);

  if (width !== expectedWidth || height !== expectedHeight) {
    throw new Error(`${relativePath} is ${width}x${height}; expected ${expectedWidth}x${expectedHeight}`);
  }

  console.log(`OK ${relativePath} ${width}x${height}`);
}
