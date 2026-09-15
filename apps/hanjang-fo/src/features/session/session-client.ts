import { Effect } from "effect";
import ky from "ky";

import { RETRY_WRITES, toError, withTimeout } from "@/shared/utils";

import type { ExamSession } from "./types";

export interface SessionClient {
  createSession: (
    examId: string,
  ) => Effect.Effect<{ sessionId: string }, unknown>;
  saveDraft: (session: ExamSession) => Effect.Effect<void, unknown>;
}

export const createKySessionClient = (prefixUrl: string): SessionClient => {
  const http = ky.create({ prefix: prefixUrl });
  return {
    createSession: (examId) =>
      withTimeout(
        Effect.tryPromise({
          try: (signal) =>
            http
              .post("sessions", { json: { examId }, signal })
              .json<{ sessionId: string }>(),
          catch: toError,
        }),
      ),
    saveDraft: (session) =>
      withTimeout(
        Effect.tryPromise({
          try: (signal) =>
            http
              .put(`sessions/${session.sessionId}`, {
                json: session,
                signal,
              })
              .then(() => undefined),
          catch: toError,
        }),
      ).pipe(Effect.retry(RETRY_WRITES)),
  };
};
