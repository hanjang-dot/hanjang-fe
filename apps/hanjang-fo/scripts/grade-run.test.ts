import assert from "node:assert/strict";
import test from "node:test";
import { Cause, Effect, Exit, Fiber } from "effect";

import { createGradeGate } from "../src/features/session/grade-run.ts";
import { createMockGradeClient } from "../src/features/session/mock-grade-client.ts";

const request = (runId: string, choiceId = "c1") => ({
  runId,
  questionId: "q1",
  choiceId,
  correctChoiceId: "c2",
});

const awaitExit = (run: { fiber: Fiber.RuntimeFiber<unknown, unknown> }) =>
  Effect.runPromise(Fiber.await(run.fiber));

test("abort 후 늦은 성공 적용 0", async () => {
  const gate = createGradeGate();
  const client = createMockGradeClient({ latencyMs: 20 });
  const firstId = gate.nextRunId();
  const first = gate.start(firstId, client.grade(request(firstId, "c2")));
  const secondId = gate.nextRunId();
  const second = gate.start(
    secondId,
    client.grade(request(secondId, "c2")),
  );
  const firstExit = await awaitExit(first);
  assert.ok(Exit.isFailure(firstExit));
  if (Exit.isFailure(firstExit)) {
    assert.ok(Cause.isInterruptedOnly(firstExit.cause));
  }
  const secondExit = await awaitExit(second);
  assert.ok(Exit.isSuccess(secondExit));
  assert.equal(gate.isCurrent(first), false);
  assert.equal(gate.isCurrent(second), true);
  if (Exit.isSuccess(secondExit)) {
    assert.equal(secondExit.value?.runId, secondId);
  }
});

test("interrupt 중인 run은 current가 아니다", async () => {
  const gate = createGradeGate();
  const client = createMockGradeClient({ neverResolve: true });
  const runId = gate.nextRunId();
  const run = gate.start(runId, client.grade(request(runId)));
  run.interrupt();
  const exit = await awaitExit(run);
  assert.ok(Exit.isFailure(exit));
  if (Exit.isFailure(exit)) {
    assert.ok(Cause.isInterruptedOnly(exit.cause));
  }
});

test("mock client 실패 주입 → fail", async () => {
  const gate = createGradeGate();
  const client = createMockGradeClient({ failNext: 1 });
  const runId = gate.nextRunId();
  const run = gate.start(runId, client.grade(request(runId)));
  const exit = await awaitExit(run);
  assert.ok(Exit.isFailure(exit));
  if (Exit.isFailure(exit)) {
    assert.equal(Cause.isInterruptedOnly(exit.cause), false);
  }
});
