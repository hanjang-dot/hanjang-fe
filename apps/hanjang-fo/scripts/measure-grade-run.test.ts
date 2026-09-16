import assert from "node:assert/strict";
import test from "node:test";
import { Effect, Exit, Fiber } from "effect";

import { createGradeGate } from "../src/features/session/grade-run.ts";
import { createMockGradeClient } from "../src/features/session/mock-grade-client.ts";
import { readSource } from "./measure-source.ts";

import type { GradeGate, GradeRun } from "../src/features/session/grade-run.ts";
import type { GradeClient } from "../src/features/session/types.ts";

interface Applied {
  runId: string;
  choiceId: string;
  resultRunId: string;
}

interface Dropped {
  runId: string;
  stale: boolean;
}

const request = (runId: string, choiceId: string) => ({
  runId,
  examSessionId: "s1",
  questionId: "q1",
  choiceId,
  correctChoiceId: "c2",
});

const awaitExit = (run: GradeRun) =>
  Effect.runPromise(Fiber.await(run.fiber));

const drive = () => {
  const gate: GradeGate = createGradeGate();
  const applied: Applied[] = [];
  const dropped: Dropped[] = [];
  const sent = new Map<string, string>();
  const choose = (client: GradeClient, choiceId: string): GradeRun => {
    const runId = gate.nextRunId();
    const run = gate.start(runId, client.grade(request(runId, choiceId)));
    sent.set(runId, choiceId);
    run.fiber.addObserver((exit) => {
      const record = (stale: boolean) => {
        if (Exit.isSuccess(exit)) {
          dropped.push({ runId, stale });
        }
      };
      if (!gate.isCurrent(run)) {
        record(true);
        return;
      }
      if (!Exit.isSuccess(exit)) return;
      if (exit.value.runId !== runId) {
        record(false);
        return;
      }
      applied.push({
        runId,
        choiceId: exit.value.choiceId,
        resultRunId: exit.value.runId,
      });
    });
    return run;
  };
  return { gate, applied, dropped, sent, choose };
};

type Drive = ReturnType<typeof drive>;

const REPS = 5;

const scenarios: { name: string; run: (d: Drive) => Promise<void> }[] = [
  {
    name: "S1 단일 채점",
    run: async (d) => {
      await awaitExit(d.choose(createMockGradeClient(), "c2"));
    },
  },
  {
    name: "S2 채점 중 재선택",
    run: async (d) => {
      const first = d.choose(createMockGradeClient({ latencyMs: 25 }), "c1");
      const second = d.choose(createMockGradeClient(), "c2");
      await Promise.all([awaitExit(first), awaitExit(second)]);
    },
  },
  {
    name: "S3 미응답 중단 후 재채점",
    run: async (d) => {
      const first = d.choose(
        createMockGradeClient({ neverResolve: true }),
        "c1",
      );
      const second = d.choose(createMockGradeClient(), "c3");
      await Promise.all([awaitExit(first), awaitExit(second)]);
    },
  },
  {
    name: "S4 연속 3회 선택",
    run: async (d) => {
      const client = createMockGradeClient({ latencyMs: 10 });
      const runs = [
        d.choose(client, "c1"),
        d.choose(client, "c3"),
        d.choose(client, "c5"),
      ];
      await Promise.all(runs.map(awaitExit));
    },
  },
  {
    name: "S5 실패 후 재시도",
    run: async (d) => {
      const first = d.choose(createMockGradeClient({ failNext: 1 }), "c1");
      const second = d.choose(createMockGradeClient(), "c4");
      await Promise.all([awaitExit(first), awaitExit(second)]);
    },
  },
];

test("S1~S5 각 5회: 적용된 score의 runId·choiceId 일치", async () => {
  for (const { name, run } of scenarios) {
    for (let rep = 0; rep < REPS; rep += 1) {
      const d = drive();
      await run(d);
      assert.ok(d.applied.length > 0, `${name} rep${rep}: applied 0`);
      for (const entry of d.applied) {
        assert.equal(entry.resultRunId, entry.runId, name);
        assert.equal(d.sent.get(entry.runId), entry.choiceId, name);
      }
      const staleApplied = d.dropped.filter(
        (drop) => drop.stale && d.applied.some((a) => a.runId === drop.runId),
      );
      assert.equal(staleApplied.length, 0, name);
    }
  }
});

test("abort 후 늦은 성공 적용 0", async () => {
  for (let rep = 0; rep < REPS; rep += 1) {
    const d = drive();
    const first = d.choose(createMockGradeClient({ latencyMs: 30 }), "c2");
    const second = d.choose(createMockGradeClient({ latencyMs: 60 }), "c2");
    const exits = await Promise.all([awaitExit(first), awaitExit(second)]);
    const staleSuccesses = exits.filter(
      (exit, index) =>
        !d.gate.isCurrent([first, second][index]) && Exit.isSuccess(exit),
    );
    assert.equal(staleSuccesses.length, 0);
    assert.deepEqual(
      d.applied.map((a) => a.runId),
      [second.runId],
    );
  }
});

test("grading 중 onChoice 잠금 배선", (t) => {
  const hooks = readSource("features/session/hooks.ts");
  assert.match(hooks, /variant === "grading"/);
  assert.match(hooks, /instrument\.choiceBlocked \+= 1/);
  t.diagnostic(
    "runtime-only: grading 중 탭 → choiceBlocked 증가·setAnswer 무호출은 기기 실행에서 instrument 카운터로 확인",
  );
});

test("variant 잠금 testID=sheet-variant-*", () => {
  const block = readSource("features/exam/components/question-block.tsx");
  assert.match(block, /testID=\{`sheet-variant-/);
});
