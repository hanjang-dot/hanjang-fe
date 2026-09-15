import assert from "node:assert/strict";
import test from "node:test";

import {
  remainingMs,
  rowToSession,
  sessionToRow,
} from "../src/features/session/session-codec.ts";

import type { ExamSession } from "../src/features/session/types.ts";

const session: ExamSession = {
  sessionId: "session-1",
  examId: "exam-2025-suneung-korean",
  deadlineAt: 1_800_000_000_000,
  answers: { "q-kor-1": "q-kor-1-c2", "q-kor-2": "q-kor-2-c5" },
  inkDraft: [{ points: [{ x: 10, y: 20 }, { x: 30, y: 40 }] }],
  schemaVersion: 1,
  status: "idle",
};

test("재시작 후 answers JSON 동등", () => {
  const restored = rowToSession(sessionToRow(session));
  assert.deepEqual(restored, session);
  assert.deepEqual(restored.answers, session.answers);
});

test("남은 시간 = deadlineAt − now, 오차 ≤ 1초", () => {
  const now = session.deadlineAt - 45 * 60 * 1000;
  const remaining = remainingMs(session.deadlineAt, now);
  assert.equal(remaining, 45 * 60 * 1000);
  const restored = rowToSession(sessionToRow(session));
  const drift = Math.abs(remainingMs(restored.deadlineAt, now) - remaining);
  assert.ok(drift <= 1000);
});
