import assert from "node:assert/strict";
import test from "node:test";

import { hashVariant } from "../src/features/experiments/variant.ts";

test("hashVariant는 A 또는 B만 반환한다", () => {
  const variants = new Set(
    Array.from({ length: 64 }, (_, index) =>
      hashVariant(`device-${index}:reviewPrompt`),
    ),
  );
  for (const variant of variants) {
    assert.ok(variant === "A" || variant === "B");
  }
  assert.equal(variants.size, 2);
});

test("hashVariant는 같은 seed에 같은 variant를 반환한다", () => {
  const seed = "device-abc:reviewPrompt";
  assert.equal(hashVariant(seed), hashVariant(seed));
});

test("hashVariant는 experiment key에 따라 독립 배정된다", () => {
  const deviceId = "device-abc";
  const assigned = new Set(
    ["quizResultCta", "homeStartCta", "reviewPrompt", "examTimer"].map((key) =>
      hashVariant(`${deviceId}:${key}`),
    ),
  );
  for (const variant of assigned) {
    assert.ok(variant === "A" || variant === "B");
  }
});
