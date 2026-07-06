import { execFile } from "node:child_process";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const screenshotsDir = resolve(rootDir, "store/assets/screenshots");
const promotionalDir = resolve(rootDir, "store/assets/promotional");
const renderDir = resolve(rootDir, "store/.asset-render");
const chromeCandidates = [
  process.env.CHROME_BIN,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "google-chrome",
  "google-chrome-stable",
  "chromium",
  "chromium-browser"
].filter(Boolean);

async function findChromeExecutable() {
  for (const candidate of chromeCandidates) {
    try {
      await execFileAsync(candidate, ["--version"]);
      return candidate;
    } catch {
      // Try the next common Chrome executable name.
    }
  }

  throw new Error("Unable to find Chrome. Set CHROME_BIN to a Chrome or Chromium executable and rerun pnpm store:assets.");
}

function createScreenshotHtml(mode) {
  const cssUrl = pathToFileURL(resolve(rootDir, "extension/src/newtab.css")).href;
  const moduleUrl = pathToFileURL(resolve(rootDir, "extension/src/newtab.js")).href;

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Del or Keep Store Screenshot</title>
    <link rel="stylesheet" href="${cssUrl}" />
    <style>
      body { background-attachment: scroll; }
      .page-shell { min-height: 800px; }
    </style>
  </head>
  <body>
    <main id="app" class="app" aria-live="polite"></main>
    <script>
      const now = Date.UTC(2026, 6, 7, 9, 0, 0);
      const dayMs = 24 * 60 * 60 * 1000;
      Date.now = () => now;
      Math.random = () => 0;

      const bookmarks = [
        {
          id: "design-systems",
          parentId: "1",
          index: 0,
          title: "Design Systems Field Guide",
          url: "https://example.com/articles/design-systems-field-guide",
          dateAdded: now - 190 * dayMs
        },
        {
          id: "launch-checklist",
          parentId: "1",
          index: 1,
          title: "Launch checklist for focused makers",
          url: "https://example.com/notes/launch-checklist",
          dateAdded: now - 92 * dayMs
        },
        {
          id: "fresh-link",
          parentId: "1",
          index: 2,
          title: "Fresh bookmark that stays out of the queue",
          url: "https://example.com/today",
          dateAdded: now - 2 * dayMs
        }
      ];
      const storageState = {};

      window.chrome = {
        bookmarks: {
          async getTree() {
            return [
              {
                id: "0",
                children: [
                  {
                    id: "1",
                    title: "Bookmarks bar",
                    children: bookmarks
                  }
                ]
              }
            ];
          },
          async remove() {},
          async create(details) {
            return {
              id: "restored",
              parentId: details.parentId ?? "1",
              index: details.index ?? 0,
              title: details.title,
              url: details.url,
              dateAdded: now
            };
          }
        },
        tabs: {
          async create(details) {
            return details;
          }
        },
        storage: {
          local: {
            async get(key) {
              return { [key]: storageState[key] };
            },
            async set(value) {
              Object.assign(storageState, value);
            }
          }
        }
      };

      if (${JSON.stringify(mode)} === "delete-confirmation") {
        const timer = window.setInterval(() => {
          const deleteButton = [...document.querySelectorAll("button")].find((button) => button.textContent.includes("Delete"));

          if (deleteButton) {
            deleteButton.click();
            window.clearInterval(timer);
          }
        }, 40);
      }
    </script>
    <script type="module" src="${moduleUrl}"></script>
  </body>
</html>`;
}

function createPromoHtml({ size }) {
  const isMarquee = size === "marquee";

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Del or Keep Promo</title>
    <style>
      :root {
        color-scheme: light;
        --bg: #edf3ee;
        --ink: #1d211c;
        --muted: #677166;
        --line: #cad5ca;
        --paper: #ffffff;
        --accent: #2f665f;
        --danger: #b7423d;
      }

      * { box-sizing: border-box; }

      html,
      body {
        width: 100%;
        height: 100%;
        margin: 0;
      }

      body {
        display: grid;
        place-items: center;
        background:
          linear-gradient(90deg, rgba(47, 102, 95, 0.08) 1px, transparent 1px),
          linear-gradient(rgba(47, 102, 95, 0.08) 1px, transparent 1px),
          var(--bg);
        background-size: ${isMarquee ? "34px 34px" : "22px 22px"};
        color: var(--ink);
        font-family: "Avenir Next", "Helvetica Neue", Arial, sans-serif;
      }

      .composition {
        position: relative;
        display: grid;
        grid-template-columns: ${isMarquee ? "1fr 0.92fr" : "58px 1fr"};
        align-items: center;
        gap: ${isMarquee ? "68px" : "18px"};
        width: 100%;
        height: 100%;
        padding: ${isMarquee ? "56px 92px" : "24px 30px"};
      }

      .mark {
        display: grid;
        width: ${isMarquee ? "112px" : "58px"};
        height: ${isMarquee ? "112px" : "58px"};
        place-items: center;
        border: 2px solid var(--line);
        border-radius: 8px;
        background: var(--paper);
        color: var(--accent);
        font-family: "SFMono-Regular", Consolas, monospace;
        font-size: ${isMarquee ? "30px" : "16px"};
        font-weight: 800;
        box-shadow: 0 20px 44px rgba(38, 49, 42, 0.13);
      }

      .copy {
        display: ${isMarquee ? "block" : "none"};
      }

      h1 {
        margin: 28px 0 0;
        font-size: 72px;
        line-height: 0.95;
        letter-spacing: 0;
      }

      p {
        max-width: 500px;
        margin: 20px 0 0;
        color: var(--muted);
        font-size: 24px;
        line-height: 1.35;
      }

      .browser {
        justify-self: ${isMarquee ? "end" : "center"};
        width: ${isMarquee ? "525px" : "292px"};
        border: 1px solid var(--line);
        border-radius: 8px;
        background: var(--paper);
        box-shadow: 0 28px 70px rgba(38, 49, 42, 0.2);
        overflow: hidden;
      }

      .toolbar {
        display: flex;
        gap: 7px;
        padding: 13px;
        border-bottom: 1px solid var(--line);
      }

      .dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: var(--line);
      }

      .stack {
        display: grid;
        gap: ${isMarquee ? "16px" : "10px"};
        padding: ${isMarquee ? "30px" : "16px"};
      }

      .bookmark {
        border: 1px solid var(--line);
        border-radius: 8px;
        padding: ${isMarquee ? "18px" : "12px"};
      }

      ${isMarquee ? "" : ".stack .bookmark:nth-child(2) { display: none; }"}

      .line {
        height: ${isMarquee ? "18px" : "10px"};
        border-radius: 999px;
        background: #dbe5da;
      }

      .line + .line {
        width: 68%;
        margin-top: ${isMarquee ? "12px" : "8px"};
        background: #edf2ec;
      }

      .actions {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: ${isMarquee ? "12px" : "8px"};
        margin-top: ${isMarquee ? "22px" : "14px"};
      }

      .action {
        height: ${isMarquee ? "46px" : "28px"};
        border-radius: 8px;
        background: #e9f0ec;
      }

      .action:first-child { background: var(--accent); }
      .action:last-child { background: var(--danger); }

      @media (max-width: 600px) {
        .composition { padding: 20px 28px; }
      }
    </style>
  </head>
  <body>
    <div class="composition">
      <div>
        <div class="mark">D/K</div>
        <div class="copy">
          <h1>Del or Keep</h1>
          <p>Review old bookmarks one new tab at a time.</p>
        </div>
      </div>
      <div class="browser" aria-hidden="true">
        <div class="toolbar"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>
        <div class="stack">
          <div class="bookmark">
            <div class="line"></div>
            <div class="line"></div>
            <div class="actions"><div class="action"></div><div class="action"></div><div class="action"></div></div>
          </div>
          <div class="bookmark">
            <div class="line"></div>
            <div class="line"></div>
          </div>
        </div>
      </div>
    </div>
  </body>
</html>`;
}

async function renderWithChrome(chromePath, userDataDir, name, width, height, html, outputPath) {
  const htmlPath = resolve(renderDir, `${name}.html`);

  await writeFile(htmlPath, html);
  await rm(outputPath, { force: true });

  const chromeArgs = [
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    "--no-first-run",
    "--no-default-browser-check",
    "--allow-file-access-from-files",
    "--force-device-scale-factor=1",
    `--user-data-dir=${userDataDir}`,
    `--window-size=${width},${height}`,
    `--screenshot=${outputPath}`,
    "--virtual-time-budget=2200",
    pathToFileURL(htmlPath).href
  ];

  try {
    await execFileAsync(chromePath, chromeArgs, { timeout: 8000, killSignal: "SIGKILL" });
  } catch (error) {
    if (!(await hasPngDimensions(outputPath, width, height))) {
      throw error;
    }
  }

  if (!(await hasPngDimensions(outputPath, width, height))) {
    throw new Error(`Chrome did not create a valid ${width}x${height} PNG at ${outputPath}`);
  }

  console.log(`Generated ${outputPath}`);
}

async function hasPngDimensions(filePath, width, height) {
  try {
    const buffer = await readFile(filePath);
    const isPng = buffer.subarray(0, 8).toString("hex") === "89504e470d0a1a0a";

    return isPng && buffer.readUInt32BE(16) === width && buffer.readUInt32BE(20) === height;
  } catch {
    return false;
  }
}

await mkdir(screenshotsDir, { recursive: true });
await mkdir(promotionalDir, { recursive: true });
await rm(renderDir, { recursive: true, force: true });
await mkdir(renderDir, { recursive: true });

const chromePath = await findChromeExecutable();
const userDataDir = await mkdtemp(resolve(tmpdir(), "del-or-keep-store-assets-"));

try {
  await renderWithChrome(
    chromePath,
    userDataDir,
    "review-queue",
    1280,
    800,
    createScreenshotHtml("review"),
    resolve(screenshotsDir, "review-queue.png")
  );
  await renderWithChrome(
    chromePath,
    userDataDir,
    "delete-confirmation",
    1280,
    800,
    createScreenshotHtml("delete-confirmation"),
    resolve(screenshotsDir, "delete-confirmation.png")
  );
  await renderWithChrome(
    chromePath,
    userDataDir,
    "small-promo",
    440,
    280,
    createPromoHtml({ size: "small" }),
    resolve(promotionalDir, "small-promo.png")
  );
  await renderWithChrome(
    chromePath,
    userDataDir,
    "marquee-promo",
    1400,
    560,
    createPromoHtml({ size: "marquee" }),
    resolve(promotionalDir, "marquee-promo.png")
  );
} finally {
  await rm(userDataDir, { recursive: true, force: true });
}
