import { Effect } from "effect";
import ky from "ky";

import { toError, withTimeout } from "@/shared/utils";

import type { GradeClient } from "./types";

export const createKyGradeClient = (prefixUrl: string): GradeClient => {
  const http = ky.create({ prefix: prefixUrl });
  return {
    grade: ({ runId, questionId, choiceId }) =>
      withTimeout(
        Effect.tryPromise({
          try: (signal) =>
            http
              .post("grade", {
                json: { questionId, choiceId, runId },
                signal,
              })
              .json<{ correct: boolean }>(),
          catch: toError,
        }).pipe(
          Effect.map((body) => ({
            runId,
            questionId,
            choiceId,
            correct: body.correct,
          })),
        ),
      ),
  };
};
