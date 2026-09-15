import assert from "node:assert/strict";
import test from "node:test";

import {
  tileCountFor,
  visibleTileRange,
} from "../src/features/exam/visible-tile-range.ts";

const TILE = 512;
const IMAGE_HEIGHT = 2400;

test("보이는 타일만 decode 범위", () => {
  const count = tileCountFor(IMAGE_HEIGHT, TILE);
  assert.equal(count, 5);
  assert.deepEqual(visibleTileRange(0, 800, TILE, count), {
    start: 0,
    end: 2,
  });
  assert.deepEqual(visibleTileRange(1200, 800, TILE, count), {
    start: 2,
    end: 4,
  });
  assert.deepEqual(visibleTileRange(10000, 800, TILE, count), {
    start: 5,
    end: 5,
  });
});

test("경계: 빈 이미지·0 타일", () => {
  assert.equal(tileCountFor(0, TILE), 0);
  assert.deepEqual(visibleTileRange(0, 800, TILE, 0), { start: 0, end: 0 });
});
