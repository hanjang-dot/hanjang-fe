import assert from "node:assert/strict";
import test from "node:test";

import {
  remainingMs,
  rowToSession,
  sessionToRow,
} from "../src/features/session/session-codec.ts";
import { readSource, screenSources } from "./measure-source.ts";

import type { ExamSession } from "../src/features/session/types.ts";

const sessions: ExamSession[] = [
  {
    sessionId: "session-1",
    examId: "exam-2025-suneung-korean",
    deadlineAt: 1_800_000_000_000,
    answers: { "q-kor-1": "q-kor-1-c2", "q-kor-2": "q-kor-2-c5" },
    inkDraft: [{ points: [{ x: 10, y: 20 }, { x: 30, y: 40 }] }],
    schemaVersion: 1,
    status: "idle",
  },
  {
    sessionId: "session-2",
    remoteId: "remote-9",
    examId: "exam-2024-suneung-math",
    deadlineAt: 1_800_003_600_000,
    answers: {},
    inkDraft: [],
    schemaVersion: 1,
    status: "restoring",
  },
  {
    sessionId: "session-3",
    examId: "exam-unicode",
    deadlineAt: 1_799_999_999_999,
    answers: { "q-ünï": "선지—⑤\"\\" },
    inkDraft: [{ points: [] }, { points: [{ x: -1.5, y: 0.25 }] }],
    schemaVersion: 1,
    status: "aborted",
  },
];

test("재시작 후 answers JSON 동등", () => {
  for (const session of sessions) {
    const restored = rowToSession(sessionToRow(session));
    assert.deepEqual(restored, session);
    assert.deepEqual(restored.answers, session.answers);
  }
});

test("남은 시간 = deadlineAt − now, 오차 ≤ 1초 (fake clock)", () => {
  const now = 1_800_000_000_000;
  for (const offset of [0, 999, 45 * 60 * 1000, -5_000]) {
    const deadline = now + offset;
    assert.ok(Math.abs(remainingMs(deadline, now) - offset) <= 1000);
  }
  for (const session of sessions) {
    const restored = rowToSession(sessionToRow(session));
    const drift = Math.abs(
      remainingMs(restored.deadlineAt, now) -
        remainingMs(session.deadlineAt, now),
    );
    assert.ok(drift <= 1000);
  }
});

test("복원 전 onChoice 잠금 배선", (t) => {
  const hooks = readSource("features/session/hooks.ts");
  assert.match(hooks, /if \(!hydrated\)/);
  assert.match(hooks, /instrument\.choiceBlocked \+= 1/);
  t.diagnostic(
    "runtime-only: restoring/hydrate 전 탭 → choiceBlocked 증가는 기기 실행에서 instrument 카운터로 확인",
  );
});

test("목록 마운트 후 자동 이동 0", () => {
  const effectWithNav =
    /useEffect\(\s*\(\)\s*=>\s*\{[\s\S]*?router\.(push|replace|navigate|dismissTo)\(\s*[`'"]\/exam[\s\S]*?\},\s*\[/;
  const offenders = screenSources().filter(({ source }) =>
    effectWithNav.test(source),
  );
  assert.deepEqual(
    offenders.map(({ path }) => path),
    [],
  );
  const library = readSource("screens/library-screen.tsx");
  assert.match(library, /onPress=\{\(\) => router\.push\(`\/exam\//);
});
