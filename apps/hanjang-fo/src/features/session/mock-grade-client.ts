import { Effect } from "effect";

import type { GradeClient, GradeResult } from "./types";

export interface MockGradeOptions {
  latencyMs?: number;
  failNext?: number;
  neverResolve?: boolean;
}

export const createMockGradeClient = ({
  latencyMs = 0,
  failNext = 0,
  neverResolve = false,
}: MockGradeOptions = {}): GradeClient => {
  let failures = failNext;
  return {
    grade: ({ runId, questionId, choiceId, correctChoiceId }) => {
      if (neverResolve) return Effect.never;
      const respond = Effect.suspend(() => {
        if (failures > 0) {
          failures -= 1;
          return Effect.fail<Error>(new Error("grade-mock-failure"));
        }
        const result: GradeResult = {
          runId,
          questionId,
          choiceId,
          correct: choiceId === correctChoiceId,
        };
        return Effect.succeed(result);
      });
      return latencyMs > 0
        ? Effect.sleep(latencyMs).pipe(Effect.andThen(respond))
        : respond;
    },
  };
};
