import assert from "node:assert/strict";
import test from "node:test";

import { assignVariant } from "../src/features/experiments/assign-variant.ts";

test("같은 deviceId면 항상 같은 variant", () => {
  assert.equal(assignVariant("device-1"), assignVariant("device-1"));
});

test("variant는 A 또는 B만 반환한다", () => {
  for (let i = 0; i < 100; i += 1) {
    assert.match(assignVariant(`device-${i}`), /^[AB]$/);
  }
});

test("deviceId에 따라 A와 B가 모두 배정된다", () => {
  const variants = new Set(
    Array.from({ length: 100 }, (_, i) => assignVariant(`device-${i}`)),
  );
  assert.deepEqual([...variants].sort(), ["A", "B"]);
});
