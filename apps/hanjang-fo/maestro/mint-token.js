#!/usr/bin/env node
// Mints a dev JWT pair for the E2E student and prints shell exports.
// Usage: eval "$(node mint-token.js <userId>)"
const crypto = require("crypto");

const userId = process.argv[2];
if (!userId) {
  console.error("usage: mint-token.js <userId>");
  process.exit(1);
}

const b64 = (value) =>
  Buffer.from(JSON.stringify(value)).toString("base64url");

const sign = (payload, secret, ttlSec) => {
  const now = Math.floor(Date.now() / 1000);
  const header = b64({ alg: "HS256", typ: "JWT" });
  const body = b64({ ...payload, iat: now, exp: now + ttlSec });
  const sig = crypto
    .createHmac("sha256", secret)
    .update(`${header}.${body}`)
    .digest("base64url");
  return `${header}.${body}.${sig}`;
};

const access = sign({ userId }, "dev-access-secret", 3600);
const refresh = sign(
  { userId, deviceId: "e2e-maestro" },
  "dev-refresh-secret",
  14 * 24 * 3600,
);

console.log(`export E2E_ACCESS_TOKEN='${access}'`);
console.log(`export E2E_REFRESH_TOKEN='${refresh}'`);
