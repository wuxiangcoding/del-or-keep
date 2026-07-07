import { spawnSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import { extname } from "node:path";

const skippedExtensions = new Set([
  ".gif",
  ".ico",
  ".jpeg",
  ".jpg",
  ".pdf",
  ".png",
  ".webp",
  ".zip"
]);

const rules = [
  {
    name: "GitHub token",
    pattern: /\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9_]{20,}\b/
  },
  {
    name: "GitHub fine-grained token",
    pattern: /\bgithub_pat_[A-Za-z0-9_]{20,}\b/
  },
  {
    name: "OpenAI API key",
    pattern: /\bsk-[A-Za-z0-9_-]{20,}\b/
  },
  {
    name: "Slack token",
    pattern: /\bxox[baprs]-[A-Za-z0-9-]{20,}\b/
  },
  {
    name: "AWS access key",
    pattern: /\bAKIA[0-9A-Z]{16}\b/
  },
  {
    name: "private key",
    pattern: /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/
  },
  {
    name: "secret assignment",
    pattern: /\b(?:api[_-]?key|secret|token|password)\b\s*[:=]\s*["'][A-Za-z0-9_./+=-]{16,}["']/i
  },
  {
    name: "internal release wording",
    pattern: /\b(?:repository is private|private repository|private repo|Manual Owner Actions|registration fee|publisher contact email|LaunchProjects|seafaring|ashing)\b/i
  }
];

function listRepositoryFiles() {
  const result = spawnSync("git", ["ls-files", "-z", "--cached", "--others", "--exclude-standard"], {
    encoding: "buffer",
    stdio: ["ignore", "pipe", "pipe"]
  });

  if (result.status !== 0) {
    throw new Error(result.stderr.toString("utf8") || "Unable to list tracked files.");
  }

  return result.stdout.toString("utf8").split("\0").filter(Boolean);
}

function shouldSkip(filePath) {
  if (filePath === "scripts/security-scan.mjs") {
    return true;
  }

  return skippedExtensions.has(extname(filePath).toLowerCase());
}

const findings = [];

for (const filePath of listRepositoryFiles()) {
  if (shouldSkip(filePath)) {
    continue;
  }

  const contents = await readFile(filePath, "utf8");
  const lines = contents.split(/\r?\n/);

  for (const [index, line] of lines.entries()) {
    for (const rule of rules) {
      if (rule.pattern.test(line)) {
        findings.push(`${filePath}:${index + 1}: ${rule.name}`);
      }
    }
  }
}

if (findings.length) {
  console.error("Security scan failed:");
  for (const finding of findings) {
    console.error(`- ${finding}`);
  }
  process.exit(1);
}

console.log("Security scan passed.");
