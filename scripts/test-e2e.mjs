import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

function loadEnvFile(envPath) {
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    if (process.env[key] !== undefined) continue;
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  }
}

loadEnvFile(".env");

const e2eUrl = process.env.E2E_DATABASE_URL;
if (!e2eUrl) {
  console.error(
    "E2E_DATABASE_URL is required. Set it to a Postgres database that is not your app database.",
  );
  process.exit(1);
}

const env = { ...process.env, DATABASE_URL: e2eUrl };
if (env.PLAYWRIGHT_BROWSERS_PATH?.includes("sandbox-cache")) {
  delete env.PLAYWRIGHT_BROWSERS_PATH;
}

const devLockPath = path.join(".next", "lock");
if (existsSync(devLockPath)) {
  try {
    const info = JSON.parse(readFileSync(devLockPath, "utf8"));
    console.warn(
      `Note: next dev is running (PID ${info.pid}, port ${info.port}). E2E uses next start on 43124 and does not need dev to stop.`,
    );
  } catch {
    /* ignore */
  }
}

function run(command, args) {
  const result = spawnSync(command, args, { stdio: "inherit", env });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

run("npx", ["prisma", "migrate", "deploy"]);
run("npm", ["run", "build"]);
run("npx", ["playwright", "test"]);
