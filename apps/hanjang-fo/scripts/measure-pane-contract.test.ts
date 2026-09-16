import assert from "node:assert/strict";
import test from "node:test";

import {
  tileCountFor,
  visibleTileRange,
} from "../src/features/exam/visible-tile-range.ts";
import { readSource } from "./measure-source.ts";

const examScreen = readSource("screens/exam-screen.tsx");
const passagePane = readSource("features/exam/components/passage-pane.tsx");
const inkLayer = readSource("features/exam/components/ink-layer.tsx");
const questionBlock = readSource("features/exam/components/question-block.tsx");
const sessionHooks = readSource("features/session/hooks.ts");

test("문항 폭 계약: 지문 길이와 무관하게 고정", (t) => {
  const contract = JSON.parse(readSource("shared/pane-contract.json"));
  assert.equal(contract.tabletBreakpoint, 768);
  assert.match(examScreen, /<PassagePane/);
  assert.match(examScreen, /questions:\s*\{\s*flex:\s*1/);
  t.diagnostic(
    "runtime-only: 짧은 PNG vs 긴 PNG 실제 px 비교(≤1px)는 레이아웃 후 측정 필요",
  );
});

test("스트로크는 지문 pane absolute overlay에만 그린다", (t) => {
  assert.match(passagePane, /<Svg style=\{styles\.ink\} pointerEvents="none">/);
  assert.match(passagePane, /position:\s*"absolute"/);
  assert.match(passagePane, /<InkLayer/);
  assert.doesNotMatch(questionBlock, /InkLayer|Svg/);
  t.diagnostic(
    "runtime-only: 스트로크 20개 후 첫 선지 y = 0 은 RN 레이아웃에서만 측정 가능",
  );
});

test("선지 탭 계측 훅 배선: onChoice=choiceTaps, onStrokeStart=strokeStarts", (t) => {
  assert.match(sessionHooks, /instrument\.choiceTaps \+= 1/);
  assert.match(inkLayer, /instrument\.strokeStarts \+= 1/);
  assert.doesNotMatch(questionBlock, /InkLayer|GestureDetector/);
  t.diagnostic(
    "runtime-only: 선지 박스 탭 10회 → choiceTaps 10 / strokeStarts 0 은 기기 실행에서 instrument 카운터로 확인",
  );
});

test("지문 위 수평 팬=스트로크, 세로 팬=스크롤 제스처 계약", (t) => {
  assert.match(inkLayer, /\.activeOffsetX\(/);
  assert.match(inkLayer, /\.failOffsetY\(/);
  t.diagnostic(
    "runtime-only: 수평 팬 중 contentOffset.y = 0 은 제스처 실행에서만 확인 가능",
  );
});

test("지문 decode ≤ 보이는 타일", () => {
  const TILE = 512;
  const VIEWPORT = 800;
  const LONG_PNG = 8192;
  const SHORT_PNG = 800;
  const budget = Math.ceil(VIEWPORT / TILE) + 1;
  assert.ok(tileCountFor(SHORT_PNG, TILE) <= budget);
  const count = tileCountFor(LONG_PNG, TILE);
  assert.ok(count > budget);
  for (let scrollY = 0; scrollY <= LONG_PNG; scrollY += 137) {
    const { start, end } = visibleTileRange(scrollY, VIEWPORT, TILE, count);
    const rendered = end - start;
    assert.ok(rendered <= budget, `scrollY=${scrollY} rendered=${rendered}`);
    assert.ok(rendered < count, `scrollY=${scrollY} rendered=${rendered}`);
  }
});
