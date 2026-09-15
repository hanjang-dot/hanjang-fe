import { Effect, Fiber } from "effect";

import type { GradeResult } from "./types";

export interface GradeRun {
  runId: string;
  fiber: Fiber.RuntimeFiber<GradeResult, unknown>;
  interrupt: () => void;
}

export interface GradeGate {
  nextRunId: () => string;
  start: (
    runId: string,
    effect: Effect.Effect<GradeResult, unknown>,
  ) => GradeRun;
  isCurrent: (run: GradeRun) => boolean;
}

let runSeq = 0;

const mintRunId = () => {
  runSeq += 1;
  return `run-${runSeq}`;
};

export const createGradeGate = (): GradeGate => {
  let current: GradeRun | null = null;
  return {
    nextRunId: mintRunId,
    start: (runId, effect) => {
      current?.interrupt();
      const run: GradeRun = {
        runId,
        fiber: Effect.runFork(effect),
        interrupt: () => {
          Effect.runFork(Fiber.interrupt(run.fiber));
        },
      };
      current = run;
      return run;
    },
    isCurrent: (run) => current === run,
  };
};
