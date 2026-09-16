import { Effect } from "effect";

import { hanjangApi } from "@/shared/api-client";

import type { GradeClient } from "./types";

export const createRemoteGradeClient = (): GradeClient => ({
  grade: ({ runId, examSessionId, questionId, choiceId }) =>
    hanjangApi!.grade
      .answer({ examSessionId, questionId, choice: choiceId })
      .pipe(
        Effect.map((body) => ({
          runId: body.runId || runId,
          questionId,
          choiceId,
          correct: body.correct,
        })),
      ),
});
