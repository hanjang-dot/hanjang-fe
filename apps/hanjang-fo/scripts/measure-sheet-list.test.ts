import assert from "node:assert/strict";
import test from "node:test";

import {
  MAX_EMPTY_PAGE_STREAK,
  canFetchNext,
  dedupePages,
} from "../src/features/exam/list-utils.ts";
import { readSource } from "./measure-source.ts";

const library = readSource("screens/library-screen.tsx");
const instrumentation = readSource("shared/instrumentation.ts");

const paper = (examId: string) => ({ examId });

test("200행 목록은 recycle 윈도우만 마운트 (LegendList 계약)", (t) => {
  assert.match(library, /import \{ LegendList \}/);
  assert.match(library, /recycleItems/);
  assert.match(library, /keyExtractor=\{\(paper\) => paper\.examId\}/);
  assert.doesNotMatch(library, /FlatList/);
  t.diagnostic(
    "runtime-only: 200행 초기 마운트 실제 개수(화면 안 + recycle 윈도우)는 기기 실행에서만 측정 가능",
  );
});

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
  assert.equal(canFetchNext(true, freshCounts), true);
});

test("unique 0 페이지 연속 시 fetchNext ≤ 5", () => {
  assert.equal(MAX_EMPTY_PAGE_STREAK, 5);
  const counts = [2, 0, 0, 0, 0, 0];
  assert.equal(canFetchNext(true, counts.slice(0, 5)), true);
  assert.equal(canFetchNext(true, counts), false);
  assert.match(library, /canFetchNext\(Boolean\(hasNextPage\), freshCounts\)/);
});

test("표지 decode 계측 카운터 존재", (t) => {
  assert.match(instrumentation, /coverDecodes/);
  assert.match(instrumentation, /reset/);
  t.diagnostic(
    "runtime-only: 표지 decode ≤ 보이는 행 — 현재 카드는 표지를 렌더하지 않아 coverDecodes=0 (vacuous). 표지 렌더 추가 시 행 mount당 coverDecodes+=1 배선 필요",
  );
});

test("목록 주어는 시험지 고르기", () => {
  assert.match(library, /<ExamCard/);
  assert.match(library, /router\.push\(`\/exam\/\$\{paper\.examId\}`\)/);
});
