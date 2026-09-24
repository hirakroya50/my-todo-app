import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";

function loadEnvFile(path) {
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
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

if (!process.env.AUTH_SECRET) {
  console.error("AUTH_SECRET is required to start the app for end-to-end tests.");
  process.exit(1);
}

const env = { ...process.env, DATABASE_URL: e2eUrl };

function run(command, args) {
  const result = spawnSync(command, args, { stdio: "inherit", env });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

run("npx", ["prisma", "migrate", "deploy"]);
run("npx", ["playwright", "test"]);
