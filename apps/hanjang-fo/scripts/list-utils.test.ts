import assert from "node:assert/strict";
import test from "node:test";

import {
  MAX_EMPTY_PAGE_STREAK,
  canFetchNext,
  dedupePages,
  trailingEmptyPages,
} from "../src/features/exam/list-utils.ts";

const paper = (examId: string) => ({ examId });

test("중복 3페이지여도 다음 다른 examId가 이어진다", () => {
  const pages = [
    [paper("a"), paper("b")],
    [paper("a"), paper("c")],
    [paper("a"), paper("b")],
    [paper("d")],
  ];
  const { items, freshCounts } = dedupePages(pages);
  assert.deepEqual(
    items.map((item) => item.examId),
    ["a", "b", "c", "d"],
  );
  assert.deepEqual(freshCounts, [2, 1, 0, 1]);
});

test("unique 0 페이지는 fetchNext ≤ 5", () => {
  assert.equal(trailingEmptyPages([2, 1, 0]), 1);
  assert.equal(
    canFetchNext(true, [2, 0, 0, 0, 0]),
    true,
  );
  assert.equal(
    canFetchNext(true, [2, 0, 0, 0, 0, 0]),
    false,
  );
  assert.equal(MAX_EMPTY_PAGE_STREAK, 5);
  assert.equal(canFetchNext(false, [2, 0]), false);
});
