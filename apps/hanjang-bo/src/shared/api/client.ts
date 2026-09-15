import { Duration, Effect, Schedule } from "effect";
import ky, { HTTPError } from "ky";

import { useAdminSession } from "@/shared/auth/admin-session";
import {
  API_BASE_URL,
  API_RETRY_COUNT,
  API_RETRY_DELAY_MS,
  API_TIMEOUT_MS,
} from "@/shared/config/constants";

export const api = ky.create({
  prefixUrl: API_BASE_URL.replace(/\/?$/, "/"),
  hooks: {
    beforeRequest: [
      (request) => {
        const token = useAdminSession.getState().token;
        if (token) {
          request.headers.set("Authorization", `Bearer ${token}`);
        }
      },
    ],
    afterResponse: [
      (_request, _options, response) => {
        if (response.status === 401) {
          useAdminSession.getState().signOut();
        }
      },
    ],
  },
});

const isRetryable = (error: Error) =>
  !(error instanceof HTTPError) ||
  error.response.status === 429 ||
  error.response.status >= 500;

const retryPolicy = Schedule.exponential(Duration.millis(API_RETRY_DELAY_MS)).pipe(
  Schedule.intersect(Schedule.recurs(API_RETRY_COUNT)),
);

export const request = <T>(call: (signal: AbortSignal) => Promise<T>): Promise<T> =>
  Effect.runPromise(
    Effect.tryPromise({
      try: (signal) => call(signal),
      catch: (cause) => (cause instanceof Error ? cause : new Error(String(cause))),
    }).pipe(
      Effect.retry({ schedule: retryPolicy, while: isRetryable }),
      Effect.timeout(Duration.millis(API_TIMEOUT_MS)),
      Effect.catchTag("TimeoutException", () => Effect.fail(new Error("요청 시간 초과"))),
    ),
  );
