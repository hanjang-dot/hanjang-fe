import { createHmac, randomUUID } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const beDir =
  process.env.HANJANG_BE_DIR ??
  "/Volumes/Untitled/Documents/Github/hanjang-workspace/hanjang-be";

const env = Object.fromEntries(
  readFileSync(join(beDir, ".env"), "utf8")
    .split("\n")
    .filter((line) => /^[A-Z_]+=/.test(line))
    .map((line) => [line.slice(0, line.indexOf("=")), line.slice(line.indexOf("=") + 1)]),
);

const sign = (payload, secret) => {
  const b64 = (value) =>
    Buffer.from(JSON.stringify(value)).toString("base64url");
  const data = `${b64({ alg: "HS256", typ: "JWT" })}.${b64(payload)}`;
  const sig = createHmac("sha256", secret).update(data).digest("base64url");
  return `${data}.${sig}`;
};

const userId = "e2e00000-0000-4000-8000-0000000000e2";
const deviceId = "e2e-maestro";

const psql = (sql) =>
  execFileSync(
    "psql",
    [
      "-h",
      process.env.PGHOST ?? "localhost",
      "-p",
      process.env.PGPORT ?? "5432",
      "-U",
      process.env.PGUSER ?? "postgres",
      "-d",
      process.env.PGDATABASE ?? "hanjang",
      "-c",
      sql,
    ],
    { env: { ...process.env, PGPASSWORD: process.env.PGPASSWORD ?? "postgres" }, stdio: ["ignore", "pipe", "inherit"] },
  );

psql(
  `INSERT INTO users ("userId", email, password) VALUES ('${userId}', 'e2e@hanjang.dev', 'e2e') ON CONFLICT ("userId") DO NOTHING;`,
);
psql(
  `INSERT INTO "authIdentity" ("userId", provider, "providerUserId") VALUES ('${userId}', 'kakao', 'e2e-kakao') ON CONFLICT (provider, "providerUserId") DO NOTHING;`,
);

const accessToken = sign(
  { userId, iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + 86400 },
  env.JWT_ACCESS_TOKEN_SECRET,
);
const refreshToken = sign(
  { userId, deviceId, iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + 1209600 },
  env.JWT_REFRESH_TOKEN_SECRET,
);

writeFileSync(
  join(here, ".env.e2e"),
  `MAESTRO_ACCESS_TOKEN=${accessToken}\nMAESTRO_REFRESH_TOKEN=${refreshToken}\n`,
);
console.log(`wrote ${join(here, ".env.e2e")} for user ${userId}`);
